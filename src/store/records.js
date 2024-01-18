import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { saveRecord, updateRecord } from "@/services/records.service";
import { useContextsStore } from "@/store/contexts";
import { calculateStatByDay } from "@/utils/statistics/getStatByDay";

const day = new Date();
day.setHours(0, 0, 0, 0);
console.log(day, "day in records store");

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
    console.log(manualDate.value, "manual dayForSearch");
    return records.value.filter((record) => record.date == manualDate.value);
  });

  const getRecordById = computed(() => {
    return (id) => {
      console.log(id, "id in get record by id");
      return records.value.find((record) => record._id === id);
    };
  });

  const getSelectedTags = computed(() => tags.value);
  const getSelectedLifeSphere = computed(() => lifeSphere.value);
  const getSelectedImportance = computed(() => importance.value);

  const allLifeSpheres = computed(() => contextsStore.getLifeSpheres);
  const allImportances = computed(() => contextsStore.getImportances);

  const getStatByDay = computed(() => {
    return (props) => {
      const { dayForSearch = day, includeWholeDay = false } = props;
      // NOTE: new
      const stat = calculateStatByDay({
        dayForSearch,
        includeWholeDay,
        allLifeSpheres: allLifeSpheres.value,
        allImportances: allImportances.value,
        recordsByDay: getRecordsByDay.value,
      });

      return stat
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
    console.log(
      JSON.stringify(tagsValue),
      "- tagsValue /set tags in record store!!!",
    );
    // console.log(tags.value, 'tags before tagsValue added')
    tags.value = tagsValue;
    // console.log(tags.value, 'tags after tagsValue added')
  }
  function setComment(commentValue) {
    comment.value = commentValue;
  }

  function saveRecordToDb() {
    console.log("save manual record in record store");
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

    saveRecord(payload);
  }

  function updateRecordInDb(id) {
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

    updateRecord({ record, recordId: id });
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
    getStatByDay,
    getRecordById,
  };
});
