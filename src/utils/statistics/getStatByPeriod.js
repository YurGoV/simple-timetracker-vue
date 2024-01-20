export const calculateStatByPeriod = ({
  daysInPeriod,
  includeWholeDay,
  allLifeSpheres,
  allImportances,
  recordsByPeriod,
}) => {
  const lifeSpheres = {};

  const lifeSpheresDataCount = {};
  const importancesDataCount = {};
  const backgroundColorSetup = [
    "#41B883",
    "#E46651",
    "#00D8FF",
    "#DD1B16",
    "#808080",
  ];

  // TODO: move this logic (define names, types & values)
  // to back to 'populate' in mongoDB
  const idsDataValues = {};

  const lifeSphereTypeName = allLifeSpheres[0].type;
  const importanceTypeName = allImportances[0].type;

  lifeSpheres[lifeSphereTypeName] = {};
  lifeSpheres[lifeSphereTypeName].datasets = [
    {
      backgroundColor: [...backgroundColorSetup],
    },
  ];

  lifeSpheres[importanceTypeName] = {};
  lifeSpheres[importanceTypeName].datasets = [
    {
      backgroundColor: [...backgroundColorSetup],
    },
  ];
  for (const sphere of allLifeSpheres) {
    lifeSpheresDataCount[sphere.value] = 0;

    idsDataValues[sphere._id] = [sphere.type, sphere.value];
  }
  for (const sphere of allImportances) {
    importancesDataCount[sphere.value] = 0;

    idsDataValues[sphere._id] = [sphere.type, sphere.value];
  }

  for (const record of recordsByPeriod) {
    const timeInMinutes = (record.endTime - record.startTime) / 1000 / 60;
    const lifeValue = idsDataValues[record.lifeSphere][1];

    const importanceValue = idsDataValues[record.importance][1];

    lifeSpheresDataCount[lifeValue] += timeInMinutes;
    importancesDataCount[importanceValue] += timeInMinutes;
  }

  // TODO: DRY
  const dayTimeInMin = 720; // whole day tracked tim length in minutes
  const periodTimeInMin = daysInPeriod * dayTimeInMin;
  const lifeSpheresLabels = [
    ...Object.keys(lifeSpheresDataCount),
    "untracked time",
  ];
  let lifeSpheresDatasets;
  if (!includeWholeDay) {
    lifeSpheresDatasets = [...Object.values(lifeSpheresDataCount), 0];
  } else {
    const resultValues = [];
    let usedTime = 0;
    for (const value of Object.values(lifeSpheresDataCount)) {
      const countedValue = (100 / periodTimeInMin) * value;
      resultValues.push(countedValue);
      usedTime += countedValue;
    }
    resultValues.push(periodTimeInMin - usedTime);

    lifeSpheresDatasets = resultValues;
  }
  const importancesLabels = [
    ...Object.keys(importancesDataCount),
    "untracked time",
  ];
  let importancesDatasets;
  if (!includeWholeDay) {
    importancesDatasets = [...Object.values(importancesDataCount), 0];
  } else {
    const resultValues = [];
    let usedTime = 0;
    for (const value of Object.values(importancesDataCount)) {
      const countedValue = (100 / periodTimeInMin) * value;
      resultValues.push(countedValue);
      usedTime += countedValue;
    }
    resultValues.push(periodTimeInMin - usedTime);

    importancesDatasets = resultValues;
  }

  lifeSpheres[lifeSphereTypeName].labels = lifeSpheresLabels;
  lifeSpheres[lifeSphereTypeName].datasets[0].data = lifeSpheresDatasets;
  lifeSpheres[importanceTypeName].labels = importancesLabels;
  lifeSpheres[importanceTypeName].datasets[0].data = importancesDatasets;

  return lifeSpheres;
};
