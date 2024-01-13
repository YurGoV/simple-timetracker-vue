import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { saveRecord } from "@/services/records.service";
import { useContextsStore } from "@/store/contexts";

export const useRecordsStore = defineStore("records", () => {
  const contextsStore = useContextsStore();

  const records = ref(null);

  const manualDate = ref(null);
  const manualStartTime = ref(null);
  const manualEndTime = ref(null);

  const lifeSphere = ref("");
  const importance = ref(null);
  const tags = ref(null);
  const comment = ref(null);

  const day = new Date();
  day.setHours(0, 0, 0, 0);
  console.log(day, "day in records store");

  const getAllRecords = computed(() => records.value);

  const getRecordsByDay = computed((dayForSearch = day) => {
    console.log(dayForSearch, "dayForSearch");
    return records.value.filter((record) =>
      record.date == dayForSearch.getTime()
    );
  });

  const allLifeSpheres = computed(() => contextsStore.getLifeSpheres);
  const allImportances = computed(() => contextsStore.getImportances);

  const getStatByDay = computed(() => {
    return (props) => {
      const { dayForSearch = day, includeWholeDay = false } = props;
      console.log(dayForSearch, "DDFFSS");
      console.log(includeWholeDay, "DD WW FFSS");
      // TODO: move count logic to utils
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

      console.log("LOOK");
      const lifeSphereTypeName = allLifeSpheres.value[0].type;
      const importanceTypeName = allImportances.value[0].type;

      lifeSpheres[lifeSphereTypeName] = {};
      lifeSpheres[lifeSphereTypeName].datasets = [{
        backgroundColor: [...backgroundColorSetup],
      }];

      lifeSpheres[importanceTypeName] = {};
      lifeSpheres[importanceTypeName].datasets = [{
        backgroundColor: [...backgroundColorSetup],
      }];
      // setup life sphere
      for (const sphere of allLifeSpheres.value) {
        // console.log(sphere, "shpere in for");
        lifeSpheresDataCount[sphere.value] = 0;

        idsDataValues[sphere._id] = [sphere.type, sphere.value];
      }
      // setup importance
      for (const sphere of allImportances.value) {
        importancesDataCount[sphere.value] = 0;

        idsDataValues[sphere._id] = [sphere.type, sphere.value];
      }

      for (const record of getRecordsByDay.value) {
        const timeInMinutes = (record.endTime - record.startTime) / 1000 / 60;
        const lifeValue = idsDataValues[record.lifeSphere][1];

        const importanceValue = idsDataValues[record.importance][1];

        lifeSpheresDataCount[lifeValue] += timeInMinutes;
        importancesDataCount[importanceValue] += timeInMinutes;
      }

      // TODO: revfactoring & move to utils
      const untrackedTime = 720; // whole day tracked tim length in minutes
      // life spheres section
      const lifeSpheresLabels = [
        ...Object.keys(
          lifeSpheresDataCount,
        ),
        "untracked time",
      ];
      let lifeSpheresDatasets;
      if (!includeWholeDay) {
        lifeSpheresDatasets = [
          ...Object.values(
            lifeSpheresDataCount,
          ),
          0,
        ];
      } else {
        const resultValues = [];
        let usedTime = 0;
        for (
          const value of Object.values(
            lifeSpheresDataCount,
          )
        ) {
          const countedValue = 100 / untrackedTime * value;
          resultValues.push(countedValue);
          usedTime += countedValue;
        }
        resultValues.push(untrackedTime - usedTime);

        lifeSpheresDatasets = resultValues;
        console.log(resultValues, "RESULT VALUES");
      }
      // importance section
      const importancesLabels = [
        ...Object.keys(
          importancesDataCount,
        ),
        "untracked time",
      ];
      let importancesDatasets;
      if (!includeWholeDay) {
        importancesDatasets = [
          ...Object.values(
            importancesDataCount,
          ),
          0,
        ];
      } else {
        const resultValues = [];
        let usedTime = 0;
        for (
          const value of Object.values(
            importancesDataCount,
          )
        ) {
          const countedValue = 100 / untrackedTime * value;
          resultValues.push(countedValue);
          usedTime += countedValue;
        }
        resultValues.push(untrackedTime - usedTime);

        importancesDatasets = resultValues;
        console.log(resultValues, "RESULT VALUES");
      }

      lifeSpheres[lifeSphereTypeName].labels = lifeSpheresLabels;
      lifeSpheres[lifeSphereTypeName].datasets[0].data = lifeSpheresDatasets;
      lifeSpheres[importanceTypeName].labels = importancesLabels;
      lifeSpheres[importanceTypeName].datasets[0].data = importancesDatasets;

      console.log(lifeSpheres, "LSF-DATA");

      return lifeSpheres;
    };
  });

  function setupRecords(gettedRecords) {
    console.log(gettedRecords);
    records.value = gettedRecords;
  }

  function setManualDate(date) {
    console.log(date, "manual date in store");
    manualDate.value = date;
  }
  function setManualStartTime(startTime) {
    manualStartTime.value = startTime;
  }
  function setManualEndTime(endTime) {
    manualEndTime.value = endTime;
  }

  function setLifeSphere(lifeSphereValue) {
    console.log(lifeSphereValue, "LS value in record store");
    lifeSphere.value = lifeSphereValue;
  }
  function setImportance(importanceValue) {
    importance.value = importanceValue;
  }
  function setTags(tagsValue) {
    tags.value = tagsValue;
  }
  function setComment(commentValue) {
    comment.value = commentValue;
  }

  function saveRecordToDb() {
    console.log("save record in record store");
    const payload = {
      date: manualDate.value,
      startTime: manualStartTime.value,
      endTime: manualEndTime.value,
      lifeSphere: lifeSphere.value,
      importance: importance.value,
      tags: tags.value,
      comment: comment.value,
    };

    saveRecord(payload);
  }

  function savePomodoroRecordToDb({
    pomodoroDate,
    pomororoStartTime,
    pomodoroEndTime,
  }) {
    console.log("save record in record store");
    const payload = {
      date: pomodoroDate,
      startTime: pomororoStartTime,
      endTime: pomodoroEndTime,
      lifeSphere: lifeSphere.value,
      importance: importance.value,
      tags: tags.value,
      comment: comment.value,
    };

    saveRecord(payload);
  }

  return {
    setupRecords,
    getAllRecords,
    setManualDate,
    setManualStartTime,
    setManualEndTime,
    setLifeSphere,
    setImportance,
    setTags,
    saveRecordToDb,
    setComment,
    //
    savePomodoroRecordToDb,
    getRecordsByDay,
    getStatByDay,
  };
});
