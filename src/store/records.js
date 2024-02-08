import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { saveRecord, updateRecord } from "@/services/records.service";
import { useContextsStore } from "@/store/contexts";
import { calculateStatByPeriod } from "@/utils/statistics/getStatByPeriod";
import { periodByPreset } from "@/utils/statistics/periodsPresetValues";
import { getDaysInPeriod } from "@/utils/statistics/getDaysInPeriod";

const day = new Date();
day.setHours(0, 0, 0, 0);

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
    // console.log(allContextsObj, "ACO");
    return records.value
      .filter((record) => record.date == manualDate.value)
      .map((data) => {
        // console.log(allContextsObj.value, "ACO");
        data.importanceValue = allContextsObj.value[data.importance];
        data.lifeSphereValue = allContextsObj.value[data.lifeSphere];
        const tagsValue = [];
        for (const el of data.tags) {
          tagsValue.push(allContextsObj.value[el]);
        }
        data.tagsValue = tagsValue;
        return data;
      });
  });

  function getRecordsByPeriod({ startSearchDay, endSearchDay }) {
    return records.value.filter(
      (record) => record.date >= startSearchDay && record.date <= endSearchDay,
    );
  }
  const getRecordById = computed(() => {
    return (id) => {
      return records.value.find((record) => record._id === id);
    };
  });

  const getSelectedTags = computed(() => tags.value);
  const getSelectedLifeSphere = computed(() => lifeSphere.value);
  const getSelectedImportance = computed(() => importance.value);
  const getSelectedComment = computed(() => comment.value);

  const allLifeSpheres = computed(() => contextsStore.getLifeSpheres);
  const allImportances = computed(() => contextsStore.getImportances);

  const allContextsObj = computed(() => {
    // console.log(contextsStore.getAllContexts[0], "CS GAC");
    const result = {};
    for (const el of contextsStore.getAllContexts) {
      result[el._id] = el.value;
    }
    return result;
  });

  const getStatByPeriod = computed(() => {
    return (props) => {
      const { period, includeWholeDay = false } = props;
      const periodForSearch = periodByPreset(period);
      const daysInPeriod = getDaysInPeriod(periodForSearch);
      const recordsByPeriod = getRecordsByPeriod(periodForSearch);
      // NOTE: new
      const stat = calculateStatByPeriod({
        daysInPeriod,
        includeWholeDay,
        allLifeSpheres: allLifeSpheres.value,
        allImportances: allImportances.value,
        recordsByPeriod,
      });

      return stat;
    };
  });

  function setupRecords(gettedRecords) {
    records.value = gettedRecords;
  }

  function setManualDate(date) {
    manualDate.value = date;
  }
  function setManualStartTime(startTime) {
    manualStartTime.value = startTime;
  }
  function setManualEndTime(endTime) {
    manualEndTime.value = endTime;
  }

  function setLifeSphere(lifeSphereValue) {
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

  async function saveRecordToDb() {
    const payload = {
      date: manualDate.value,
      startTime: manualStartTime.value,
      endTime: manualEndTime.value,
      lifeSphere: lifeSphere.value,
      importance: importance.value,
      tags: tags.value,
      comment: comment.value,
    };

    try {
      const newRecord = await saveRecord(payload);
      if (newRecord) {
        records.value.push(newRecord);
      }
      return true;
    } catch {
      return false;
    }
  }

  // TODO: refactor there & in pomodoros count & timer
  // to startTime & end time
  async function savePomodoroRecordToDb({
    pomodoroDate,
    pomororoStartTime,
    pomodoroEndTime,
  }) {
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
    // console.log(newRecord, "NNNRRR");
    if (newRecord) {
      records.value.push(newRecord);
      return await newRecord;
    }
    return false;
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

    try {
      const updatedRecord = await updateRecord({ record, recordId: id });
      if (updatedRecord) {
        const recordIndex = records.value.findIndex(
          (record) => record._id === updatedRecord._id,
        );
        records.value[recordIndex] = updatedRecord;
      }
      return true;
    } catch {
      return false;
    }
  }

  return {
    setupRecords,
    getAllRecords,
    getSelectedLifeSphere,
    getSelectedImportance,
    getSelectedTags,
    getSelectedComment,
    getRecordsByDay,
    getStatByPeriod,
    getRecordById,
    setManualDate,
    setManualStartTime,
    setManualEndTime,
    setLifeSphere,
    setImportance,
    setTags,
    saveRecordToDb,
    setComment,
    updateRecordInDb,
    savePomodoroRecordToDb,
  };
});
