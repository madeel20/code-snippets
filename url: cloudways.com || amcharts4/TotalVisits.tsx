import {DatePicker} from 'antd'
import {useGetResourceVisitsQuery} from 'app/services'
// import { useGetResourceBandwidthQuery, useGetResourceDiskSpaceQuery, useGetResourceVisitsQuery } from 'app/services';
import {Col, Row} from 'Common/Components/Core/DesignTemplates'
import {Tooltip} from 'Common/Components/Core/DesignTemplates/Tooltip/Tooltip'
import {abbreviateNumber, EpochToDate} from 'Common/Components/Core/Modal/util'
import {Form, Formik, FormikHelpers} from 'formik'
import moment from 'moment'
import React from 'react'
import * as Yup from 'yup'
import PieChart1 from '../Charts/PieChartVisits'
import PieChart2 from '../Charts/XYChartVIsits'
import LoadingState from './LoadingState'
import '../style.css';

interface iMtdOpitons {
  mtd_options: any
}

const initialValues: iMtdOpitons = {
  mtd_options: '',
}

const VisitsTab = () => {
  const {data, isLoading} = useGetResourceVisitsQuery()
 
  //validations
  const validate = Yup.object({
    mtd_options: Yup.string().required('Please select an option.'),
  })
 
  const initialValues: iMtdOpitons = {
    mtd_options: '',
  }
 
  const onSubmit = (
    values: iMtdOpitons,
    {setSubmitting}: FormikHelpers<iMtdOpitons>,
  ) => {
    return
  }

  const {RangePicker} = DatePicker

  if (isLoading) return <LoadingState />

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validate}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form className="flex justify-end mt-24 pr-24 cwpf_dashboard_datepicker">
            <Tooltip text="Coming Soon!">
              <RangePicker disabled />
            </Tooltip>
          </Form>
        )}
      </Formik>
      <Row between styles="cwpf_chart">
        <Col >
          <PieChart2
            datapoints={
              data?.datapoints?.map((eachPoint: any) => {
                return {
                  date: EpochToDate(eachPoint?.epoch),
                  value: eachPoint?.value,
                  formattedValue: abbreviateNumber(eachPoint?.value),
                  formattedDate: moment(EpochToDate(eachPoint?.epoch)).format(
                    'DD MMMM, YYYY ',
                  ),
                  utcTime: moment(EpochToDate(eachPoint?.epoch)).format(
                    'HH:MM UTC',
                  ),
                }
              }) || []
            }
            title="hello"
            tooltipTitle="Visits: "
          />
        </Col>
        <Col >
          <PieChart1
            Legendtitle="Visits Breakdown"
            Title="Total Visits"
            space={data?.total_visits || 0}
            totalspace={data?.allocated_visits || 0}
            apps={
              data?.apps?.map((eachApp: any) => ({
                value: eachApp?.total_visits,
                name: eachApp.name,
              })) || []
            }
          />
        </Col>
      </Row>
    </div>
  )
}

export default React.memo(VisitsTab)
