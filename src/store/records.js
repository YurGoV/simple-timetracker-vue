import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { saveRecord, updateRecord } from "@/services/records.service";
import { useContextsStore } from "@/store/contexts";
import { calculateStatByPeriod } from "@/utils/statistics/getStatByPeriod";
import { periodByPreset } from "@/utils/statistics/periodsPresetValues";

const day = new Date();
day.setHours(0, 0, 0, 0);
// console.log(day, "day in records store");

export const useRecordsStore = defineStore("records", () => {
  const contextsStore = useContextsStore();

  const records = ref(null);

  const manualDate = ref(day.getTime());
  const manualStartTime = ref(null);
  const manualEndTime = ref(null);

  const lifeSphere = ref("");
  const importance = ref(null);
  const tags = ref(null);
  const comment = ref(null);

  const getAllRecords = computed(() => records.value);

  const getRecordsByDay = computed(() => {
    // console.log(manualDate.value, "manual periodForSearch");
    return records.value.filter((record) => record.date == manualDate.value);
  });

  // const getRecordsByPeriod = computed(() => {
    // return (period) => {
    function getRecordsByPeriod({startSearchDay, endSearchDay}) {
      // console.log(startSearchDay, endSearchDay, 'G S B P PERIOD')
    // console.log(manualDate.value, "manual periodForSearch");
    // return records.value.filter((record) => record.date == manualDate.value);
    return records.value.filter((record) => record.date >= startSearchDay && record.date <= endSearchDay);
    }
  // });

  const getRecordById = computed(() => {
    return (id) => {
      // console.log(id, "id in get record by id");
      return records.value.find((record) => record._id === id);
    };
  });

  const getSelectedTags = computed(() => tags.value);
  const getSelectedLifeSphere = computed(() => lifeSphere.value);
  const getSelectedImportance = computed(() => importance.value);

  const allLifeSpheres = computed(() => contextsStore.getLifeSpheres);
  const allImportances = computed(() => contextsStore.getImportances);

  const getStatByPeriod = computed(() => {
    return (props) => {
      // console.log(props, 'GSBP PROPS')
      const { period, includeWholeDay = false } = props;
      const periodForSearch = periodByPreset(period)
      // console.log(period, periodForSearch, 'PFS p e r i o d')
        const recordsByPeriod = getRecordsByPeriod(periodForSearch)
      // NOTE: new
      const stat = calculateStatByPeriod({
        period,
        includeWholeDay,
        allLifeSpheres: allLifeSpheres.value,
        allImportances: allImportances.value,
        recordsByPeriod,
      });

      return stat;
    };
  });

  function setupRecords(gettedRecords) {
    // console.log(gettedRecords);
    records.value = gettedRecords;
  }

  function setManualDate(date) {
    // console.log(date, "manual date in store");
    manualDate.value = date;
  }
  function setManualStartTime(startTime) {
    manualStartTime.value = startTime;
  }
  function setManualEndTime(endTime) {
    manualEndTime.value = endTime;
  }

  function setLifeSphere(lifeSphereValue) {
    // console.log(lifeSphereValue, "LS value in record store");
    lifeSphere.value = lifeSphereValue;
  }
  function setImportance(importanceValue) {
    importance.value = importanceValue;
  }
  function setTags(tagsValue) {
    // console.log(
    //   JSON.stringify(tagsValue),
    //   "- tagsValue /set tags in record store!!!",
    // );
    // console.log(tags.value, 'tags before tagsValue added')
    tags.value = tagsValue;
    // console.log(tags.value, 'tags after tagsValue added')
  }
  function setComment(commentValue) {
    comment.value = commentValue;
  }

  async function saveRecordToDb() {
    // console.log("save manual record in record store");
    const payload = {
      date: manualDate.value,
      startTime: manualStartTime.value,
      endTime: manualEndTime.value,
      lifeSphere: lifeSphere.value,
      importance: importance.value,
      tags: tags.value,
      comment: comment.value,
    };

    const newRecord = await saveRecord(payload);
    if (newRecord) {
      records.value.push(newRecord);
    }
    return await newRecord;
  }

  async function savePomodoroRecordToDb({
    pomodoroDate,
    pomororoStartTime,
    pomodoroEndTime,
  }) {
    // console.log("save pomodoro record in record store");
    const payload = {
      date: pomodoroDate,
      startTime: pomororoStartTime,
      endTime: pomodoroEndTime,
      lifeSphere: lifeSphere.value,
      importance: importance.value,
      tags: tags.value,
      comment: comment.value,
    };

    const newRecord = await saveRecord(payload);
    if (newRecord) {
      records.value.push(newRecord);
    }
    return await newRecord;
  }

  async function updateRecordInDb(id) {
    const record = {
      date: manualDate.value,
      startTime: manualStartTime.value,
      endTime: manualEndTime.value,
      lifeSphere: lifeSphere.value,
      importance: importance.value,
      tags: tags.value,
      comment: comment.value,
    };

    // const recordId = "65a52f2851758191a430aef7"

    const updatedRecord = await updateRecord({ record, recordId: id });
    if (updatedRecord) {
      const recordIndex = records.value.findIndex(
        (record) => record._id === updatedRecord._id,
      );
      records.value[recordIndex] = updatedRecord;
    }
    return updatedRecord;
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
    getSelectedLifeSphere,
    getSelectedImportance,
    getSelectedTags,
    saveRecordToDb,
    setComment,
    updateRecordInDb,
    //
    savePomodoroRecordToDb,
    getRecordsByDay,
    getStatByPeriod,
    getRecordById,
  };
});
