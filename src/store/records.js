import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { saveRecord } from "@/services/records.service";

export const useRecordsStore = defineStore("records", () => {
  const records = ref(null);

  const manualDate = ref(null);
  const manualStartTime = ref(null);
  const manualEndTime = ref(null);

  const lifeSphere = ref(null);
  const importance = ref(null);
  const tags = ref(null);
  const comment = ref(null);

  const day = new Date();
  day.setHours(0, 0, 0, 0);
  console.log(day, "day in records store");

  function setupRecords(gettedRecords) {
    console.log(gettedRecords);
    // records.value = records;
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
    console.log("save record in record store", day);
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

  const getAllRecords = computed(() => records.value );

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
  };
});
