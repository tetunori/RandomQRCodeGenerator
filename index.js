
// On data Capacity
const dataCapacityArrayL = [ 41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101, 1250, 1408, 1548, 1725, 1903, 2061, 2232, 2409, 2620, 2812, 3057, 3283, 3517, 3669, 3909, 4158, 4417, 4686, 4965, 5253, 5529, 5836, 6153, 6479, 6743, 7089 ]
const dataCapacityArrayM = [ 34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991, 1082, 1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701, 2857, 3035, 3289, 3486, 3693, 3909, 4134, 4343, 4588, 4775, 5039, 5313, 5596 ]
const dataCapacityArrayQ = [ 27, 48, 77, 111, 144, 178, 207, 259, 312, 364, 427, 489, 580, 621, 703, 775, 876, 948, 1063, 1159, 1224, 1358, 1468, 1588, 1718, 1804, 1933, 2085, 2181, 2358, 2473, 2670, 2805, 2949, 3081, 3244, 3417, 3599, 3791, 3993 ]
const dataCapacityArrayH = [ 17, 34, 58, 82, 106, 139, 154, 202, 235, 288, 331, 374, 427, 468, 530, 602, 674, 746, 813, 919, 969, 1056, 1108, 1228, 1286, 1425, 1501, 1581, 1677, 1782, 1897, 2022, 2157, 2301, 2361, 2524, 2625, 2735, 2927, 3057 ]

const getDataCapacity = ( errCorLevel, version ) => { 

  let retVal = undefined;

  switch( errCorLevel ){
    case 'L':
      retVal = dataCapacityArrayL[ version ];
      break;
    case 'M':
      retVal = dataCapacityArrayM[ version ];
      break;
    case 'Q':
      retVal = dataCapacityArrayQ[ version ];
      break;
    case 'H':
      retVal = dataCapacityArrayH[ version ];
      break;
  }

  return retVal;

}

// Get Version number at random
const getRandomVersion = () => { return getRandomInt( getMinVersion(), getMaxVersion() ); }

function getRandomInt( min, max ) {

  min = Math.ceil( min );
  max = Math.floor( max );

  if( min >= max ){
    return min;
  }else{
    return Math.floor( Math.random() * ( max + 1 - min ) ) + min;
  }

}

// Generate random data
const generateRandomData = () => {

  // There seems to be bug on the max capacity boundary value defined above.
  // So I did minus 10 as work-around.
  const size = getDataCapacity( getErrCorrectionLevel(), getRandomVersion() ) - 10;
  let data = '';
  
  for( let i = 0; i < size; i++ ){
    data += Math.floor( Math.random() * 9 );
  }

  // console.log( data );
  return data;

}

// Get error correction level
const getErrCorrectionLevel = () => {
  return document.getElementById( "errCorrectionLevel" ).value;
}

// Draw QR code
function drawQRCode(){

  const QRCodeCanvas = document.getElementById( "QRCode" );

  QRCode.toCanvas( QRCodeCanvas, generateRandomData(), {
      margin: 2,
      scale: 3,
      errorCorrectionLevel: getErrCorrectionLevel()
  } );
  
  const QRCodeContainer = document.getElementById( "QRCodeContainer" );
  QRCodeCanvas.style.left = QRCodeContainer.clientWidth / 2 - QRCodeCanvas.width / 2;
  QRCodeCanvas.style.top = QRCodeContainer.clientHeight / 2 - QRCodeCanvas.height / 2;

};


// On settings
const convertHzToMillisec = ( hz ) => { return 1 / hz * 1000 };

document.getElementById( "refreshRateSlidebar" ).addEventListener( "input", async ev => {
  
  document.getElementById( "refreshRateText" ).innerText = 
      'Refresh rate: ' + ev.target.value + 'Hz ( ' 
        + Math.floor( convertHzToMillisec( ev.target.value ) ) + 'msec per 1 QR code )';
  
});

let timerID = setInterval( drawQRCode, 300 );
document.getElementById( "refreshRateSlidebar" ).addEventListener( "change", async ev => {

  if( timerID ){
    clearTimeout( timerID );
  }
  timerID = setInterval( drawQRCode, convertHzToMillisec( ev.target.value ) );

});

const getMinVersion = () => {
  return document.getElementById( "minVersionSlidebar" ).value;
}
const getMaxVersion = () => {
  return document.getElementById( "maxVersionSlidebar" ).value;
}

document.getElementById( "minVersionSlidebar" ).addEventListener( "input", async ev => {
  
  document.getElementById( "minVersionText" ).innerText = 
      'Min Version: ' + ev.target.value + ' (' + ( 17 + 4 * ev.target.value ) + 'cells)';
  
});

document.getElementById( "maxVersionSlidebar" ).addEventListener( "input", async ev => {
  
  document.getElementById( "maxVersionText" ).innerText = 
      'Max Version: ' + ev.target.value + ' (' + ( 17 + 4 * ev.target.value ) + 'cells)';
  
});


// Show readme
document.getElementById( "btShowReadMe" ).addEventListener( "click", async ev => {
  window.open('https://github.com/tetunori/RandomQRCodeGenerator/blob/master/README.md','_blank');
});

