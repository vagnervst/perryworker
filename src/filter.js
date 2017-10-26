function BlackList(toFilterItems) {
  return {
    has: item => {

      for( let i = 0; i < toFilterItems.length; i += 1 ) {
        if( item === toFilterItems[i] ) {
          return true;
        }
      }

      return false;
    }
  }
}

export default BlackList;
