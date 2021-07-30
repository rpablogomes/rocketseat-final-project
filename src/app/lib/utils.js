exports.getSince = function () {
    let newSince = new Date();
  
    const year = newSince.getFullYear();
    const month = newSince.getMonth();
    const date = newSince.getDate();
  
    const UTFsince = `${date}/${month + 1}/${year}`;
  
    return UTFsince;
  }