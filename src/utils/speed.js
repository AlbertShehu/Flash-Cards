// Kthen tabelë shpejtësish (ms) në bazë të settings
export function getSpeedTable(settings) {
  return [
    { display: settings.slowestDisplay, interval: settings.slowestInterval },
    { display: settings.slowDisplay,    interval: settings.slowInterval    },
    { display: settings.normalDisplay,  interval: settings.normalInterval  },
    { display: settings.fastDisplay,    interval: settings.fastInterval    },
    { display: settings.fastestDisplay, interval: settings.fastestInterval },
  ];
}
