import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Input,
  Form,
  Popover,
  Select,
  Spin,
  DatePicker,
} from "antd";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import DateFnsUtils from "@date-io/date-fns";
import {
  deleteAUser,
  getAllUsers,
  getUsersStatistics,
  saveUserCredits,
} from "../../../store/Actions/AdminUsersActions";
import { getDaysAgo, getFormattedDate } from "../../../utils/helpers";
const { RangePicker } = DatePicker;

const UsersStatistics = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(
    getFormattedDate(new Date())
  );
  const [showDatePicker, updateShowDatePicker] = useState(false);

  useEffect(() => {
    dispatch(getUsersStatistics(selectedDate));
  }, [selectedDate]);

  // get redux state
  const stateProps = useSelector(({ users }) => ({ ...users }));

  const { usersStatisticsLoading, statistics } = stateProps;

  const data = {
    labels: statistics?.labels || [],
    datasets: [
      {
        label: "Emails",
        data: statistics?.data || [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  const onChangeFilter = (val) => {
    if (val === "custom-date") {
      updateShowDatePicker(true);
    } else {
      setSelectedDate(val);
      updateShowDatePicker(false);
    }
  };

  const onChangeDatesRange = (dates) => {
    if (!dates) setSelectedDate(new Date());
    else
      setSelectedDate({
        startDate: new Date(getFormattedDate(dates[0])),
        endDate: new Date(getFormattedDate(dates[1])),
      });
  };

  const filterView = () => {
    return (
      <div className="section-filter">
        <Select
          defaultValue=""
          value={showDatePicker ? "custom-date" : selectedDate}
          className="c-select"
          onChange={(val) => onChangeFilter(val)}
        >
          <Select.Option value={getDaysAgo(0)}>Today</Select.Option>
          <Select.Option value={getDaysAgo(7)}>Last Week</Select.Option>
          <Select.Option value={getDaysAgo(30)}>Last Month</Select.Option>
          <Select.Option value="custom-date">Custom Date</Select.Option>
        </Select>

        {showDatePicker && <RangePicker onChange={onChangeDatesRange} />}
      </div>
    );
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="c-user-statistics">
        {filterView()}
        {usersStatisticsLoading ? (
          <div className="c-user-statistics loader-container">
            <Spin size="large" />
          </div>
        ) : (
          <Bar {...config} />
        )}
      </div>
    </MuiPickersUtilsProvider>
  );
};

export default UsersStatistics;