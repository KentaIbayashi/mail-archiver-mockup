<template>
  <div class="main-container" :class="{mobile: mode=='mobile'}">
    <div class="date-picker-container">
      <div class="input-container">
        <div class="calender-icon-container">
          <img class="calender-icon" src="@/assets/icon_calender.svg" width="20" height="20">
        </div>
        <el-date-picker
          class="date-picker start-date"
          v-model="inputStart"
          @change="changeDate"
          type="date"
          placeholder="Start Date"
          :clearable="false"
          prefix-icon="icon-disabled">
        </el-date-picker>
        -
        <el-date-picker
          class="date-picker end-date"
          v-model="inputEnd"
          @change="changeDate"
          type="date"
          placeholder="End Date"
          :clearable="false"
          prefix-icon="icon-disabled">
        </el-date-picker>
      </div>
      <span class="search-icon-container">
        <img class="search-icon" src="@/assets/icon_search.svg" width="20" height="20">
      </span>
    </div>
    <div class="result-area">
      <span>Results: </span>
      <span class="accent-text">{{resultMails.length}}</span>
      <span>mail(s)</span>
    </div>
    <div class="archiver-area">
      <div class="archiver-symbol" v-if="resultMails.length == 0">
        <img class="logo" src="@/assets/logo.png">
      </div>
      <div v-else>
        <div class="table-area">
          <div class="mail-table">
            <div class="mail-table-header">
              <div class="mail-table-header-row">
                <div
                  class="header-column"
                  :class="field.toLowerCase() + '-column'"
                  @click="sortMails(field)"
                  v-for="(field, index) in fields"
                  :key="index"
                >
                  <div class="field" :class="{'sorted-field': sortBy == field}">
                    {{field}}
                    <img
                      class="arrow-icon"
                      src="@/assets/icon_arrow01.svg"
                      width="14" height="14"
                      v-if="sortBy == field && !sortDesc"
                    />
                    <img
                      class="arrow-icon"
                      src="@/assets/icon_arrow01.svg"
                      width="14" height="14"
                      v-if="sortBy == field && sortDesc"
                      style="transform: rotateX(180deg);"
                    />
                    
                  </div>
                  <div
                    class="separator"
                    v-if="mode == 'mobile' && index != fields.length-1">
                  </div>
                </div>
                
              </div>
            </div>
            <div class="mail-table-row"
              v-for="(mail, index) in resultMails"
              :key="index"
              @click="rowClicked(index)"
            >
              <!-- Normal mode template -->
              <template v-if="mode=='normal'">
                <div class="main-row">
                  <div class="mail-table-cell from-cell from-column">
                    <div class="cell-text" :class="{'sorted-field': sortBy == 'From'}">
                      {{mail.from}}
                    </div>
                  </div>
                  <div class="mail-table-cell to-cell to-column">
                    <div class="cell-text" :class="{'sorted-field': sortBy == 'To'}">
                      {{toFormatter(mail.to)}}
                    </div>
                    <div
                      class="plus-chip"
                      v-if="mail.to.length > 1"
                    >
                      +{{mail.to.length-1}}
                    </div>
                  </div>
                  <div class="mail-table-cell subject-cell subject-column">
                    <div class="cell-text" :class="{'sorted-field': sortBy == 'Subject'}">
                      {{mail.subject}}
                    </div>
                    <img
                      src="@/assets/icon_clip.svg"
                      width="14" height="14"
                      v-if="mail.attachment"
                    />
                  </div>
                  <div class="mail-table-cell date-cell date-column" :class="{'sorted-field': sortBy == 'Date'}">
                    {{dateFormatter(mail.date)}}
                  </div>
                </div>
                <div class="body-row" v-show="mail.visible">
                  {{mail.body}}
                </div>
              </template>
              <!-- Mobile mode template -->
              <template v-else>
                <div class="main-row">
                  <div class="upper-area">
                    <div class="mail-sp">
                      <img
                        src="@/assets/icon_mail_sp.svg"
                        width="17" height="34"
                      />
                    </div>
                    <div class="upper-right-area">
                      <div class="from-date-area">
                        <div class="from-text" :class="{'sorted-field': sortBy == 'From'}">
                          {{mail.from}}
                        </div>
                        <div class="attachment-area">
                          <img
                            src="@/assets/icon_clip.svg"
                            width="16" height="16"
                            v-show="mail.attachment"
                            class="attachment-icon"
                          />
                        </div>
                        <div class="date-text" :class="{'sorted-field': sortBy == 'Date'}">
                          {{dateFormatter(mail.date)}}
                        </div>
                      </div>
                      <div class="to-area">
                        <div class="to-text" :class="{'sorted-field': sortBy == 'To'}">
                          {{toFormatter(mail.to)}}
                        </div>
                        <div
                          class="plus-chip"
                          v-if="mail.to.length > 1"
                        >
                          +{{mail.to.length-1}}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="lower-area">
                    <div class="subject-text" :class="{'sorted-field': sortBy == 'Subject'}">
                      {{mail.subject}}
                    </div>
                  </div>
                </div>
                <div class="body-row" v-show="mail.visible">
                  {{mail.body}}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment"
import _ from "lodash"

export default {
  name: 'MailArchiver',
  data() {
    return {
      inputStart: "",
      inputEnd: "",
      sortBy: 'date',
      sortDesc: false,
      fields: [
        "From",
        "To",
        "Subject",
        "Date",
      ],
      mails: [
        {
          date: "2021-01-03 00:20",
          from: "faafefefea@example.com",
          to: ["eaa@example.com"],
          subject: "Happy Holiday",
          attachment: "happy.zip",
          body: "Your Pre-Approval Session (English) with Services at 11:00 (Japan, Korea Time) on Monday, July 27, 2020 has been scheduled.Please click the meeting link below to join the video call.",
          visible: false,
        },
        {
          date: "2021-01-03 00:10",
          from: "zaa@example.com",
          to: ["zaa@example.com", "aaa@example.com"],
          subject: "Happy Holiday",
          attachment: "happy.zip",
          body: "Merry Christmas",
          visible: false,
        },
        {
          date: "2021-01-03 00:00",
          from: "ksfaefwefwefawefkk@example.com",
          to: ["kkkwefawefwafawe@example.com"],
          subject: "Happy New Year! Greetings for the New Year.",
          attachment: "happy.zip",
          body: "I hope you guys all good.",
          visible: false,
        },
        {
          date: "2021-01-05 00:00",
          from: "iii@example.com",
          to: ["iii@example.com"],
          subject: "Meeting Date",
          attachment: null,
          body: "2021/11/11",
          visible: false,
        },
        {
          date: "2020-12-29 12:40",
          from: "sss@example.com",
          to: ["sss@example.com"],
          subject: "ABC EQUIPMENT COMPANY",
          attachment: null,
          body: "invoice here",
          visible: false,
        },
        {
          date: "2021-01-09 18:20",
          from: "xxx@example.com",
          to: ["xxx@example.com"],
          subject: "Notice of official announcement",
          attachment: null,
          body: "The important notice.",
          visible: false,
        },
      ],
      resultMails: [],
    }
  },
  computed: {
    startDate: function () {
      return this.inputStart ? moment(this.inputStart).unix() : null
    },
    endDate: function () {
      return this.inputEnd ? moment(this.inputEnd).unix() : null
    },
    mailCount: function() {
      return this.mails.length
    },
    mode: function() {
      if (this.$vssWidth >= 800) {
        return "normal"
      } else {
        return "mobile"
      }
    }
  },
  methods: {
    changeDate: function() {
      this.resultMails = this.mails.filter(obj => {
        let unixTime = moment(obj.date).unix()
        if (unixTime >= this.startDate && unixTime <= this.endDate) {
          return obj
        }
      })
    },
    dateFormatter: function(rawDate) {
      let date = moment(rawDate)
      let current = moment()
      if (date.format("YYYYMMDD") == current.format("YYYYMMDD")) {
        return date.format("HH:mm")
      } else if (date.year() == current.year()) {
        return date.format("MMM DD")
      } else {
        return date.format("YYYY/MM/DD")
      }
    },
    toFormatter: function(to) {
      return to.length == 1 ? to[0] : to[0] + ", ..."
    },
    rowClicked(index) {
      this.resultMails[index].visible = this.resultMails[index].visible ? false : true
    },
    sortMails(name) {
      let sortKey = name.toLowerCase()
      if (this.sortBy == name && this.sortDesc) {
        this.resultMails = _.orderBy(this.resultMails, sortKey, "asc")
        this.sortBy = name
        this.sortDesc = false
      } else {
        this.resultMails = _.orderBy(this.resultMails, sortKey, "desc")
        this.sortBy = name
        this.sortDesc = true
      }
    }
  }
}
</script>

<style lang="scss">
.main-container {
  min-width: 320px;
}
.date-picker {
  width: 72px !important;
}
.calender-icon-container {
  width: 50px;
}
.el-input__inner {
  border: transparent !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.start-date {
  margin-left: 44px;
  width: 120px;
}
.input-container {
  border: 1px solid #e0e0e0;
  border-radius: 6px 0px 0px 6px;
  padding-right: 20px;
}
.date-picker-container {
  position: relative;
  display: flex;
  margin-bottom: 20px;
  margin-left: 50px;
  margin-top: 30px;
}
.calender-icon {
  z-index: 1;
  position: absolute;
  left: 16px;
  top: 9px;
  pointer-events: none;
}
.search-icon-container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  border: solid 1px #e0e0e0;
  border-left: 0px;
  border-radius: 0px 6px 6px 0px !important;
  background: #f4f4f4;
}
.result-area {
  margin-left: 50px;
  color: #888888;
  font-weight: bold;
}
.accent-text {
  font-size: 20px;
}
.archiver-area {
  height: 500px;
  margin-left: 50px;
  margin-right: 50px;
  border-top: solid 1px #e0e0e0;
}
.archiver-symbol {
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100%;
}
.plus-chip {
  max-width: 33px;
  background: gray;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  line-height: 1.4;
  padding: 0px 3px;
  float: right;
}
.logo {
  margin-left: auto;
  margin-right: auto;
}
.clickable-rows {
  .cell {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap !important;
  }
  tbody tr td {
    cursor: pointer;
  }
}
.row {
  display: flex;
}
.cell-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.mail-table-cell {
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 20px;
  padding-left: 20px;
  height: 50px;
  display: flex;
  align-items: center;
}
.header-column {
  padding-left: 20px;
  color: #888888;
  height: 50px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
.from-column {
  min-width: 180px;
}
.to-column {
  min-width: 240px;
}
.subject-column {
  width: 100%;
  padding-right: 0px;
}
.date-column {
  min-width: 120px;
}

.mail-table-header-row {
  background: #f4f4f4;
  display: flex;
  border-bottom: solid 1px #e0e0e0;
}
.from-header-cell, .to-header-cell, .subject-header-cell {
  font-weight: bold;
  color: #555555;
}
.date-header-cell {
  font-weight: bold;
}
.to-cell {
  justify-content: space-between;
}
.subject-cell {
  overflow: hidden;
  justify-content: space-between;
}
.body-row {
  padding: 20px;
  border-bottom: solid 1px #e0e0e0;
}
.arrow-icon {
  margin-left: 10px;
}
.main-row {
  cursor: pointer;
  display: flex;
  border-bottom: solid 1px #e0e0e0;
}
.main-row:hover {
  color: blue;
  background: #f4f4f4;
}
.closed {
  display: none;
}
.sorted-field, .sorted-field:hover {
  color: #333333;
  font-weight: bold;
}

.mobile {
  .date-picker-container {
    margin-left: 20px;
    margin-top: 20px;
  }
  .result-area {
    margin-left: 20px;
  }
  .archiver-area {
    margin-left: 0px;
    margin-right: 0px;
  }
  .main-row {
    display: block;
    padding: 15px 20px;
    border-bottom: solid 1px #e0e0e0;
  }
  .mail-table-cell {
    padding-left: 0px;
    padding-right: 0px;
  }
  .mail-table-header-row {
    padding-left: 20px;
    padding-right: 20px;
  }
  .header-column {
    padding-left: 0px;
  }
  .arrow-icon {
    margin-left: 0px;
    width: 10px;
    height: 10px;
    margin-bottom: 2px;
  }
  .upper-area {
    width: 100%;
    display: flex;
  }
  .upper-right-area {
    width: 100%;
    padding-left: 24px;
  }
  .from-date-area {
    display: flex;
    align-items: center;
  }
  .lower-area {
    font-size: 17px;
  }
  .attachment-area {
    margin-left: auto;
    margin-right: 5px;
  }
  .attachment-icon {
    margin-top: -5px;
  }
  .to-area {
    display: flex;
    align-items: center;
  }
  .to-text, .from-text, .subject-text {
    text-overflow: ellipsis;
    overflow: auto;
    white-space: nowrap;
  }
  .plus-chip {
    margin-left: auto;
  }
  .mail-sp {
    padding-top: 6px;
    position: absolute;
  }
  .date-text {
    white-space: nowrap;
  }
  .to-column, .from-column, .subject-column, .date-column {
    min-width: auto;
    width: auto;
  }
  .separator {
    height: 14px;
    border-left: 1px solid;
    margin: 0px 10px;
  }
}
</style>
