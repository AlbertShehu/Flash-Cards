// Settings të bazuar në .NET config
const defaultSettings = {
  // Shpejtësitë e shfaqjes (ms)
  slowestDisplay: 1000,
  slowestInterval: 500,
  slowDisplay: 800,
  slowInterval: 500,
  normalDisplay: 500,
  normalInterval: 500,
  fastDisplay: 300,
  fastInterval: 500,
  fastestDisplay: 100,
  fastestInterval: 500,

  // Parametra stërvitjeje
  digit: 1,
  displayFlashCalculation: 5,
  speedFlashCalculation: 3,

  // Opsione përmbajtje targets
  negativeShow: false,
  decimalShow: false,
  decimalLength: 1,

  // Pamja
  fontSize: 72,
  language: 'english',
  enableAudio: true,


  // Backgrounds
  backgrounds: ['default', 'gradient-blue', 'gradient-purple', 'dark'],
  setBackground: 'default',

};

export default defaultSettings;
