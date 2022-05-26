import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';
import { Skeleton, Row, Col, Card } from 'antd';
import RenderDot from '../components/RenderDot';
import RenderDropdown from '../components/RenderDropdown';
import WidgetTitle from '../components/WidgetTitle';
import WidgetLastUpdated from '../components/WidgetLastUpdated';
import WidgetEmptyState from '../components/WidgetEmptyState';

class SecurityPosture extends React.PureComponent {
  render() {
    const { widgetId, widgetName } = this.props && this.props.widgetConfig;

    return (
      <Card
        style={{ borderRadius: 4 }}
        bodyStyle={{
          height: 267,
        }}
        extra={this.RenderExtra()}
        title={<WidgetTitle widgetConfig={this.props.widgetConfig} />}
      >
        {!this.props.currentWidget.data || this.props.currentWidget.data.length === 0 ? (
          <WidgetEmptyState type={widgetId} widgetConfig={widgetName} />
        ) : (
          <Row justify="space-between">
            <Col span={12}>{this.RenderChart()}</Col>
            <Col
              span={12}
              style={{ display: 'flex', justifyContent: 'space-around', marginTop: 40 }}
            >
              {this.RenderSummary()}
            </Col>
          </Row>
        )}
      </Card>
    );
  }

  RenderChart = () => {
    const { widgetId, widgetName } = this.props && this.props.widgetConfig;
    if (!this.props.currentWidget.data || this.props.currentWidget.data.length === 0) {
      return <WidgetEmptyState type={widgetId} widgetConfig={widgetName} />;
    }
    const { passed, low, medium, high, percentage } = this.props.currentWidget.data;
    const { openDrawer } = this.props;
    const data = [
      {
        item: 'Passed',
        count: passed,
      },
      {
        item: 'High',
        count: high,
      },
      {
        item: 'Medium',
        count: medium,
      },
      {
        item: 'Low',
        count: low,
      },
    ]; // will contain final data
    const colors = ['#3ADFA3', '#F4657C', '#FCDB6B', '#3BA1FF']; // colors array for chart

    const { DataView } = DataSet;
    const { Html } = Guide;
    let percent = `${isNaN(percentage) ? '0' : percentage}%`;
    let status = 'Health Score';
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = `${(val * 100).toFixed(1)}%`;
          return val;
        },
      },
    };

    return (
      <div id="chart">
        <Chart
          onIntervalClick={ev => {
            let { item } = ev.data._origin;
            item = item.toLowerCase();
            item = item === 'passed' ? 'pass' : item;

            // if clicked on pass then type will be riskStatus otherwise risk_level
            let type = item === 'pass' ? 'riskStatus' : 'risk_level';

            // prepare drawer params
            let drawerParams = [
              {
                type: type,
                value: [item],
              },
            ];
            if (type === 'risk_level') {
              drawerParams.push({ type: 'riskStatus', value: ['fail'] });
            }
            openDrawer(drawerParams, 'resourceDrawer');
          }}
          height={200}
          data={dv}
          scale={cols}
          padding={[0, 0, 0, 0]}
          forceFit
        >
          <Coord type="theta" radius={1} innerRadius={0.7} />
          <Axis name="percent" />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Guide>
            <Html
              position={['50%', '50%']}
              html={` <div style="color:#1d1d1d;font-weight:500;font-size:0.8vw;text-align: center">
                ${status}
                <br />
                <span style="color:#262626;font-size:1.6vw;font-weight:500;">${percent}</span>
              </div>`}
              alignX="middle"
              alignY="middle"
            />
          </Guide>

          <Geom
            select={false}
            type="intervalStack"
            shape="sliceShape"
            position="percent"
            color={['item', colors]}
            tooltip={[
              'count*item',
              (count, item) => {
                return {
                  name: item,
                  value: count,
                };
              },
            ]}
            style={{
              lineWidth: 4,
              cursor: 'pointer',
              stroke: '#fff',
            }}
          />
        </Chart>
      </div>
    );
  };

  RenderSummary = () => {
    const { passed, low, medium, high } = this.props.currentWidget.data;
    return (
      <div id="summary">
        <p
          style={{
            fontSize: 17,
            fontWeight: 500,
            lineHeight: 1.19,
            color: '#1d1d1d',
          }}
        >
          {/* Risks */}
        </p>
        <div>
          <p style={{ lineHeight: 0.9, fontSize: 14, color: '#8c8c8c' }}>
            <RenderDot color="#F4657C" />
            High: <span style={{ color: '#1d1d1d', fontWeight: 500 }}>{high}</span>
          </p>
          <p style={{ lineHeight: 0.9, fontSize: 14, color: '#8c8c8c' }}>
            <RenderDot color="#FCDB6B" />
            Medium: <span style={{ color: '#1d1d1d', fontWeight: 500 }}>{medium}</span>
          </p>
          <p style={{ lineHeight: 0.9, fontSize: 14, color: '#8c8c8c' }}>
            <RenderDot color="#3BA1FF" />
            Low: <span style={{ color: '#1d1d1d', fontWeight: 500 }}>{low}</span>
          </p>

          <p style={{ lineHeight: 0.9, fontSize: 14, color: '#8c8c8c' }}>
            <RenderDot color="#3ADFA3" />
            Passed: <span style={{ color: '#1d1d1d', fontWeight: 500 }}>{passed}</span>
          </p>
        </div>
      </div>
    );
  };

  RenderExtra = () => {
    return (
      <div
        style={{
          marginTop: -6,
          marginBottom: -6,
        }}
      >
        <RenderDropdown {...this.props} />
        <WidgetLastUpdated currentWidget={this.props.currentWidget} />
      </div>
    );
  };
}
export default SecurityPosture;