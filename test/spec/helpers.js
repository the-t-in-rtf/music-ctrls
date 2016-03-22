function toHex(colorCode) {
  if (colorCode.indexOf('(') > 0) {
    var vals = colorCode.replace(/rgb|\(|\)/g, "").split(/ *,* /g);
    
    if (vals.length === 3) {
      return '#' + dec2hex(vals[0]) + dec2hex(vals[1]) + dec2hex(vals[2]);
    } else {
      return colorCode;
    }
  }
  return colorCode.toUpperCase();
}

function dec2hex(i) {
   return (parseInt(i) + 0x10000).toString(16).substr(-2).toUpperCase();
}