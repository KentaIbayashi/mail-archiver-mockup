<template>
  <div class="container" :class="{mobile: mode=='mobile'}">
    <div class="date-picker-container">
      <img class="calender-icon" src="@/assets/icon_calender.svg" width="20" height="20">
      <el-date-picker
        class="date-picker"
        v-model="value1"
        type="daterange"
        range-separator="-"
        start-placeholder="Start date"
        end-placeholder="End date"
        :clearable="false"
        align="left"
        prefix-icon="icon-disabled">
      </el-date-picker>
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
        <el-table
          header-row-class-name="archiver-table-header"
          :data="resultMails"
          :default-sort = "{prop: 'date', order: 'descending'}"
          ref="table"
          style="width: 100%"
          @row-click="rowClicked"
          class="clickable-rows">
          <template>
            <el-table-column
              width="40"
              type="expand">
              <template slot-scope="props">
                {{ props.row.body }}
              </template>
            </el-table-column>
            <el-table-column
              prop="from"
              label="From"
              sortable
              width="180"
              class-name="from-column">
            </el-table-column>
            <el-table-column
              prop="to"
              label="To"
              sortable
              width="180"
              class-name="to-column">
              <template slot-scope="scope">
                {{scope.row.to[0]}}
                <template v-if="scope.row.to.length > 1">
                  , ...
                </template>
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              class-name="plus-column">
              <template slot-scope="scope">
                <span
                  class="plus-chip"
                  v-if="scope.row.to.length > 1"
                >
                  +{{scope.row.to.length-1}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="subject"
              label="Subject"
              sortable
              class-name="subject-column">
            </el-table-column>
            <el-table-column
              width="25"
              class-name="attachment-column">
              <template slot-scope="scope">
                <img
                  src="@/assets/icon_clip.svg"
                  width="14" height="14"
                  v-if="scope.row.attachment"
                />
              </template>
            </el-table-column>
            <el-table-column
              class-name="date-column"
              prop="date"
              label="Date"
              width="120"
              sortable
              :formatter="formatter">
            </el-table-column>

            <el-table-column
              class-name="mobile-cell"
              width="120">
              <template slot-scope="scope">
                <div v-show="mode=='mobile'">
                <img
                  src="@/assets/icon_mail_sp.svg"
                  width="14" height="14"
                  v-if="scope.row.attachment"
                />
                {{scope.row.from}}
                {{scope.row.to}}
                {{scope.row.subject}}
                {{scope.row.date}}
                </div>
              </template>
            </el-table-column>

          </template>
        </el-table>
      </div>
    </div>
    <button @click="test">debug</button>{{mode}}
  </div>
</template>

<script>
import moment from "moment"

export default {
  name: 'MailArchiver',
  data() {
    return {
      value1: '',
      mails: [
        {
          date: "2021-01-03 00:20",
          from: "aaafefefea@example.com",
          to: ["aaa@example.com"],
          subject: "Happy Holiday",
          attachment: "happy.zip",
          body: "Your Pre-Approval Session (English) with italki Teacher Services at 11:00 (Japan, Korea Time) on Monday, July 27, 2020 has been scheduled.Please click the meeting link below to join the video call. If you re asked to enter a password, please try the meeting link below.",
        },
        {
          date: "2021-01-03 00:10",
          from: "aaa@example.com",
          to: ["aaa@example.com", "aaa@example.com"],
          subject: "Happy Holiday",
          attachment: "happy.zip",
          body: "aaaa"
        },
        {
          date: "2021-01-03 00:00",
          from: "aaa@example.com",
          to: ["aaa@example.com"],
          subject: "Happy Holiday",
          attachment: "happy.zip",
          body: "aaaa"
        },
        {
          date: "2021-01-05 00:00",
          from: "aaa@example.com",
          to: ["aaa@example.com"],
          subject: "Happy Holiday",
          attachment: null,
          body: "aaaa"
        },
        {
          date: "2020-12-29 12:40",
          from: "aaa@example.com",
          to: ["aaa@example.com"],
          subject: "Happy Holiday",
          attachment: null,
          body: "aaaa"
        },
        {
          date: "2021-01-09 18:20",
          from: "aaa@example.com",
          to: ["aaa@example.com"],
          subject: "Happy Holiday",
          attachment: null,
          body: "aaaa"
        },
      ],
    }
  },
  computed: {
    startDate: function () {
      return this.value1 ? moment(this.value1[0]).unix() : null
    },
    endDate: function () {
      return this.value1 ? moment(this.value1[1]).unix() : null
    },
    resultMails: function () {
      return this.mails.filter(obj => {
        let unixTime = moment(obj.date).unix()
        if (unixTime >= this.startDate && unixTime <= this.endDate) {
          return obj
        }
      })
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
    formatter(row) {
      let date = moment(row.date)
      let current = moment()
      if (date.format("YYYYMMDD") == current.format("YYYYMMDD")) {
        return date.format("HH:mm")
      } else if (date.year() == current.year()) {
        return date.format("MMM DD")
      } else {
        return date.format("YYYY/MM/DD")
      }
    },
    test() {
      console.log(this.$vssWidth)
    },
    rowClicked(row) {
      this.$refs.table.toggleRowExpansion(row)
    }
  }
}
</script>

<style lang="scss">
.container {
  margin: 50px;
}
.date-picker {
  width: 270px !important;
  border: solid 1px #e0e0e0 !important;
  border-radius: 6px 0px 0px 6px !important;
}
.date-picker-container {
  position: relative;
  border-radius: 6px 0px 0px 6px !important;
  display: flex;
  margin-bottom: 20px;
}
.date-picker-container .el-input__inner {
  padding-left: 22px !important;
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
.search-icon {
  
}
.result-area {
  color: #888888;
  font-weight: bold;
  border-bottom: solid 1px #e0e0e0;
}
.accent-text {
  font-size: 20px;
}
.archiver-area {
  height: 500px;
}
.archiver-symbol {
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100%;
}
.el-table th {
  background-color: #f4f4f4 !important;

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
.el-table__expanded-cell {
  cursor: default !important;
  padding: 20px 51px !important;
}
.date-cell {
  font-weight: bold;
}

.mobile {
  .date-column, .to-column, .from-column, .attachment-column, .subject-column ,.plus-column {
    display: none;
  }
}

</style>
