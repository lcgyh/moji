import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  message,
  Row,
  Col,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { connect } from 'dva';
import { getBrands } from '@/services/brand';
import { getSpec, saveGoods, getGoodsInfo, getSpecAttr } from '@/services/goods';
import PicturesWall from './components/upload';
import EditableTable from '@/components/StandardTable';
import EditableTagGroup from './components/tag';
import { addKeyForList } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
    md: {
      span: 10,
    },
  },
};

const formItemLayout1 = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 7,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
    md: {
      span: 10,
    },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 7,
    },
  },
};

class BasicForms extends Component {
  state = {
    pageType: '1',
    specList: [],
    brandList: [],
    attrList1: [],
    attrList2: [],
    goodsSkusouce: [],
    infoList: [],
    spuId: null,
    specId1: null,
    specId2: null,
    goodsPic: [],
    pdSpu: {},
    spec2Select: false,
  };

  columns = [
    {
      title: '商品规格1',
      dataIndex: 'specAttr1Str',
      width: '20%',
    },
    {
      title: '商品规格2',
      dataIndex: 'specAttr2Str',
      width: '20%',
    },
    {
      title: '商品条码',
      dataIndex: 'skuBarCode',
      width: '20%',
    },
    {
      title: '成本',
      dataIndex: 'skuSupplyPrice',
      width: '7%',
    },
    {
      title: '批发价',
      dataIndex: 'skuRetailPrice',
      width: '7%',
    },
    {
      title: '零售价',
      dataIndex: 'skuRecommendPrice',
      width: '7%',
    },
    {
      title: 'SKU图片',
      dataIndex: 'skuPic',
      width: '20%',
      render: (text, record, index) => (
        <PicturesWall
          acceptbrandPicImg={this.acceptbrandPicImg}
          type="3"
          pics={this.getUrlToArr([text])}
          index={index}
          uploadLength={1}
          disabled
        />
      ),
    },
  ];

  columns1 = [
    {
      title: '商品规格1',
      dataIndex: 'specAttr1Str',
      width: '20%',
    },
    {
      title: '商品条码',
      dataIndex: 'skuBarCode',
      width: '20%',
    },
    {
      title: '成本',
      dataIndex: 'skuSupplyPrice',
      width: '10%',
    },
    {
      title: '批发价',
      dataIndex: 'skuRetailPrice',
      width: '10%',
    },
    {
      title: '零售价',
      dataIndex: 'skuRecommendPrice',
      width: '10%',
    },
    {
      title: 'SKU图片',
      dataIndex: 'skuPic',
      width: '20%',
      render: (text, record, index) => (
        <PicturesWall
          acceptbrandPicImg={this.acceptbrandPicImg}
          type="3"
          pics={this.getUrlToArr([text])}
          index={index}
          uploadLength={1}
          disabled
        />
      ),
    },
  ];

  componentDidMount() {
    this.getSpecs();
    this.getBrands();
    this.initData();
  }

  // 查询规格信息
  getSpecs = async () => {
    const data = {
      pageSize: 99999,
      current: 1,
    };
    const result = await getSpec(data);
    if (result.code == '0') {
      const resData = result.data.list || [];
      this.setState({
        specList: resData,
      });
    } else {
    }
  };

  // 获取品牌
  getBrands = async () => {
    const result = await getBrands();
    if (result.code == '0') {
      const resData = result.data || [];
      this.setState({
        brandList: resData,
      });
    } else {
    }
  };

  initData = () => {
    // 判断参数是有有id,加入有则是编辑
    const params = this.props.match.params || {};
    const spuId = params.id;
    if (spuId) {
      this.getInfoData(spuId);
    }
  };

  // 查询详情
  getInfoData = async spuId => {
    const result = await getGoodsInfo({ spuId });
    if (result.code == '0') {
      const resData = result.data || {};
      const pdSpu = resData.pdSpu || {};
      const pdSkus = resData.pdSkus || []
      this.setState(
        {
          pageType: '2',
          pdSpu,
          spuId,
          goodsPic: pdSpu.spuPics ? this.getUrlToArr(pdSpu.spuPics) : [],
          goodsSkusouce: resData.pdSkus || [],
          infoList: pdSpu.spuDetail || [],
          spec2Select: !!pdSpu.specId2,
        },
        function() {
          if (pdSpu.specId1) {
            this.hindChange1(pdSpu.specId1);
          }
          if (pdSpu.specId2) {
            this.hindChange2(pdSpu.specId2);
          }
        },
      );
    }
  };


  // 返回
  handgoback = () => {
    this.props.history.goBack();
  };

  // 接收图片
  acceptbrandPicImg = (data, type, index) => {
    if (type == '1') {
      this.setState({
        goodsPic: data,
      });
    }
    if (type == '2') {
      if (data[0]) {
        const infoList = this.state.infoList.slice(0);
        infoList[index].value = data[0].url;
        this.setState({
          infoList,
        });
      }
    }
    if (type == '3') {
      if (data[0]) {
        const goodsSkusouce = this.state.goodsSkusouce.slice(0);
        goodsSkusouce[index].skuPic = data[0].url;
        this.setState({
          goodsSkusouce,
        });
      }
    }
  };

  // 针对url的转化
  getUrlToArr = urls => {
    const arr = [];
    if (urls) {
      for (let i = 0; i < urls.length; i++) {
        arr.push({
          uid: i,
          status: 'done',
          url: urls[i],
        });
      }
    }
    return arr;
  };

  // 查询规格1下面的属性
  hindChange1 = async value => {
    const data = { specId: value };
    const result = await getSpecAttr(data);
    if (result.code == '0') {
      const resData = result.data || [];
      this.setState({
        attrList1: resData || [],
        specId1: value,
      });
    }
  };

  // 查询规格2下面的属性
  hindChange2 = async value => {
    const data = { specId: value };
    const result = await getSpecAttr(data);
    if (result.code == '0') {
      const resData = result.data || [];
      this.setState({
        attrList2: resData || [],
        specId2: value,
      });
    }
  };

  // 新增sku
  handaddSku = () => {
    const { goodsSkusouce } = this.state;
    goodsSkusouce.push({});
    this.setState({
      goodsSkusouce,
    });
  };

  getTagData1 = tags => {
    this.setState({
      attrList1: tags,
    });
  };

  getTagData2 = tags => {
    this.setState({
      attrList2: tags,
    });
  };

  // 属性1change
  hindattrChange1 = (index, value) => {
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    goodsSkusouce[index].specAttrId1 = value;
    this.setState({
      goodsSkusouce,
    });
  };

  // 属性2change
  hindattrChange2 = (index, value) => {
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    goodsSkusouce[index].specAttrId2 = value;
    this.setState({
      goodsSkusouce,
    });
  };

  // 条码change
  hindBarcode = (index, e) => {
    const { value } = e.target;
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    goodsSkusouce[index].skuBarCode = value;
    this.setState({
      goodsSkusouce,
    });
  };

  hindsupply = (index, value) => {
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    goodsSkusouce[index].skuSupplyPrice = value;
    this.setState({
      goodsSkusouce,
    });
  };

  hindretail = (index, value) => {
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    goodsSkusouce[index].skuRetailPrice = value;
    this.setState({
      goodsSkusouce,
    });
  };

  hindText = () => {
    const { infoList } = this.state;
    infoList.push({
      type: '1',
      value: '',
    });
    this.setState({
      infoList,
    });
  };

  hindPic = () => {
    const { infoList } = this.state;
    infoList.push({
      type: '2',
      value: '',
    });
    this.setState({
      infoList,
    });
  };

  hindTextChange = (index, e) => {
    const { value } = e.target;
    const infoList = this.state.infoList.slice(0);
    infoList[index].value = value;
    this.setState({
      infoList,
    });
  };

  saveModelRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { pdSpu } = this.state;
    const brandNameList = this.state.brandList.find(item => item.brandId == pdSpu.spuBrandId);

    return (
      <PageHeaderWrapper title={() => ''}>
        <Card bordered={false}>
          <Form
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="商品名称">
              {pdSpu.spuName}
            </FormItem>
            <FormItem {...formItemLayout} label="商品品牌">
              {brandNameList ? brandNameList.brandName : ''}
            </FormItem>
            <FormItem {...formItemLayout} label="商品图片">
              <PicturesWall
                acceptbrandPicImg={this.acceptbrandPicImg}
                type="1"
                pics={this.state.goodsPic || []}
                uploadLength={this.state.goodsPic.length}
                disabled
              />
            </FormItem>
            <FormItem {...formItemLayout} label="商品卖点">
              {pdSpu.spuSellingPoint}
            </FormItem>
            <FormItem {...formItemLayout} label="卖点详情">
              {pdSpu.spuSellingPoingStr}
            </FormItem>
            <FormItem {...formItemLayout} label="商品规格1">
              {/* {getFieldDecorator('specId1', {
                initialValue: pdSpu.specId1,
              })(
                <Select placeholder="请选择" disabled onChange={this.hindChange1.bind(this)}>
                  {this.state.specList.map(item => (
                    <Option value={item.specId} key={item.specId}>
                      {item.specName}
                    </Option>
                  ))}
                </Select>,
              )} */}
              {
                pdSpu.specId1Str
              }
            </FormItem>
            <FormItem>
              <Row>
                <Col offset={4}>
                  <EditableTagGroup
                    tags={this.state.attrList1}
                    getTagData={this.getTagData1.bind(this)}
                    specId={this.state.specId1}
                    disabled
                  />
                </Col>
              </Row>
            </FormItem>
            <FormItem {...formItemLayout} label="商品规格2">
              {/* {getFieldDecorator('specId2', {
                initialValue: pdSpu.specId2,
              })(
                <Select placeholder="请选择" disabled onChange={this.hindChange2.bind(this)}>
                  <Option value="none" key="none">
                    无
                  </Option>
                  {this.state.specList.map(item => (
                    <Option value={item.specId} key={item.specId}>
                      {item.specName}
                    </Option>
                  ))}
                </Select>,
              )} */}
              {
                pdSpu.specId2Str
              }
            </FormItem>
            <FormItem>
              <Row>
                <Col offset={4}>
                  <EditableTagGroup
                    tags={this.state.attrList2}
                    getTagData={this.getTagData2.bind(this)}
                    specId={this.state.specId2}
                    disabled
                  />
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Row>
                <Col span={4} style={{ textAlign: 'right' }}>
                  商品信息：
                </Col>
                <Col span={18}>
                  <EditableTable
                    // title={() => (
                    //   <span onClick={() => this.handaddSku()}>
                    //     {' '}
                    //     <a>新增sku</a>
                    //   </span>
                    // )}
                    bordered
                    dataSource={addKeyForList(this.state.goodsSkusouce)}
                    columns={this.state.spec2Select ? this.columns : this.columns1}
                    pagination={false}
                  />
                </Col>
              </Row>
            </FormItem>
            <FormItem {...formItemLayout} label="商品详情">
              {this.state.infoList.map((item, index) =>
                (item.type == '1' ? (
                  <Row key={index}>
                    {/* <TextArea
                      rows={4}
                      onChange={this.hindTextChange.bind(this, index)}
                      value={item.value}
                      disabled
                    /> */}
                    {item.value}
                  </Row>
                ) : (
                  <Row key={index}>
                    <PicturesWall
                      acceptbrandPicImg={this.acceptbrandPicImg}
                      type="2"
                      index={index}
                      pics={this.getUrlToArr([item.value])}
                      uploadLength={1}
                      disabled
                    />
                    ,
                  </Row>
                )),
              )}
            </FormItem>
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button onClick={() => this.handgoback()}>返回</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ loading }) => ({
    submitting: loading.effects['formBasicForm/submitRegularForm'],
  }))(BasicForms),
);
