/**
  @param {Object} filterOptions
  @param {Array} filterOptions.blackList
  @param {Array} filterOptions.whiteList
  @param {Array} filterOptions.itemsToFilter
  @param {Function} getValueToCompare
*/
function Sieve(filterOptions, getValueToCompare) {

  function filterUsingWhiteList() {
    return filterInclusive( filterOptions.whiteList );
  }

  function filterUsingBlackList() {
    return filterExclusive( filterOptions.blackList );
  }

  function filterInclusive( comparableList ) {
    let filteredItems = [];

    filterOptions.itemsToFilter.forEach( item => {
      if( has(comparableList, getValueToCompare(item)) ) {
        filteredItems.push(item);
      }
    });

    return filteredItems;
  }

  function filterExclusive( comparableList ) {
    let filteredItems = [];

    filterOptions.itemsToFilter.forEach( item => {
      if( !has(comparableList, getValueToCompare(item)) ) {
        filteredItems.push(item);
      }
    });

    return filteredItems;
  }

  function has( comparableList, value ) {

    for( let i = 0; i < comparableList.length; i += 1 ) {
      if( comparableList[i] === value ) return true;
    }

    return false;
  }

  return {
    mitigate: function() {
      if( filterOptions.blackList && filterOptions.whiteList ) {
        throw {
          type: 'FilterException',
          message: "Can't filter for both blacklist and whitelist"
        };
      }

      if( filterOptions.blackList ) {
        return filterUsingBlackList();
      } else if( filterOptions.whiteList ) {
        return filterUsingWhiteList();
      }
    }
  }
}

export default Sieve;
