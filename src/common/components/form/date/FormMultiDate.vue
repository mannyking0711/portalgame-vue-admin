<template>
    <div>
      <MultiDatePicker
      v-model="date" 
      :multi="multi" 
      :always-display="false" 
      :format="formatDate"
    
      ></MultiDatePicker>
    </div>
</template>

<script>
    // import mDatePicker from 'path/to/multiDatePicker'
    // import mDatePicker from 'vue-multi-date-picker';
import MultiDatePicker from 'vue-multi-date-picker/src/lib/multiDatePicker.vue';
    export default {
        name: "FormMultiDate",
        components: {
            MultiDatePicker,
            // "m-date-picker": MultiDatePicker,
        },
        data () {
        return {
            multi: true,
            date: []
        }
        },
        
        methods: {
        formatDate(date) {
            return data.toLocaleDateString();
        }
        },
        computed: {
        datepickerTranslates() {
            return {
                formatLocale: {
                    months: [
                        this.translate('date.Month.January'),
                        this.translate('date.Month.February'),
                        this.translate('date.Month.March'),
                        this.translate('date.Month.April'),
                        this.translate('date.Month.May'),
                        this.translate('date.Month.June'),
                        this.translate('date.Month.July'),
                        this.translate('date.Month.August'),
                        this.translate('date.Month.September'),
                        this.translate('date.Month.October'),
                        this.translate('date.Month.November'),
                        this.translate('date.Month.December'),
                    ],
                    monthsShort: [
                        this.translate('date.Month.January').substring(0, 3),
                        this.translate('date.Month.February').substring(0, 3),
                        this.translate('date.Month.March').substring(0, 3),
                        this.translate('date.Month.April').substring(0, 3),
                        this.translate('date.Month.May').substring(0, 3),
                        this.translate('date.Month.June').substring(0, 3),
                        this.translate('date.Month.July').substring(0, 3),
                        this.translate('date.Month.August').substring(0, 3),
                        this.translate('date.Month.September').substring(0, 3),
                        this.translate('date.Month.October').substring(0, 3),
                        this.translate('date.Month.November').substring(0, 3),
                        this.translate('date.Month.December').substring(0, 3),
                    ],
                    weekdays: [
                        this.translate('date.Week.Monday'),
                        this.translate('date.Week.Tuesday'),
                        this.translate('date.Week.Wednesday'),
                        this.translate('date.Week.Thursday'),
                        this.translate('date.Week.Friday'),
                        this.translate('date.Week.Saturday'),
                        this.translate('date.Week.Sunday'),
                    ],
                    weekdaysMin: [
                        this.shortWeekDayName(this.translate('date.Week.Monday')),
                        this.shortWeekDayName(this.translate('date.Week.Tuesday')),
                        this.shortWeekDayName(this.translate('date.Week.Wednesday')),
                        this.shortWeekDayName(this.translate('date.Week.Thursday')),
                        this.shortWeekDayName(this.translate('date.Week.Friday')),
                        this.shortWeekDayName(this.translate('date.Week.Saturday')),
                        this.shortWeekDayName(this.translate('date.Week.Sunday'))
                    ],
                },
                monthFormat: 'MMM',
                yearFormat: 'YYYY'
            }
        }
    }
    }
</script> 