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
    focus1: false,
    focusvalue1: null,
    focus2: false,
    focusvalue2: null,
    focus3: false,
    focusvalue3: null,
  };

  columns = [
    {
      title: '商品规格1',
      dataIndex: 'specAttrId1',
      width: '20%',
      render: (text, record, index) => (
        <Select placeholder="请选择" onChange={this.hindattrChange1.bind(this, index)} value={text}>
          {this.state.attrList1.map(item => (
            <Option value={item.specAttrId} key={item.specAttrId}>
              {item.specAttrName}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '商品规格2',
      dataIndex: 'specAttrId2',
      width: '20%',
      render: (text, record, index) => (
        <Select placeholder="请选择" onChange={this.hindattrChange2.bind(this, index)} value={text}>
          {this.state.attrList2.map(item => (
            <Option value={item.specAttrId} key={item.specAttrId}>
              {item.specAttrName}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '商品条码',
      dataIndex: 'skuBarCode',
      width: '20%',
      render: (text, record, index) => (
        <Input value={text} onChange={this.hindBarcode.bind(this, index)} maxLength={32} />
      ),
    },

    {
      title: '成本',
      dataIndex: 'skuSupplyPrice',
      width: '7%',
      render: (text, record, index) => (
        <InputNumber
          min={0}
          max={99999}
          step={0.1}
          precision={2}
          value={text}
          onChange={this.hindsupply.bind(this, index)}
        />
      ),
    },
    {
      title: '批发价',
      dataIndex: 'skuRetailPrice',
      width: '7%',
      render: (text, record, index) => (
        <InputNumber
          min={0}
          max={99999}
          step={0.1}
          precision={2}
          value={text}
          onChange={this.hindretail.bind(this, index)}
        />
      ),
    },
    {
      title: '零售价',
      dataIndex: 'skuRecommendPrice',
      width: '7%',
      render: (text, record, index) => (
        <InputNumber
          min={0}
          max={99999}
          step={0.1}
          precision={2}
          value={text}
          onChange={this.hindreretail.bind(this, index)}
        />
      ),
    },
    {
      title: 'SKU图片',
      dataIndex: 'skuPic',
      width: '10%',
      render: (text, record, index) => (
        <PicturesWall
          acceptbrandPicImg={this.acceptbrandPicImg}
          type="3"
          pics={text ? this.getUrlToArr([text]) : []}
          index={index}
          uploadLength={1}
        />
      ),
    },

    {
      title: '操作',
      dataIndex: 'op',
      width: '10%',
      render: (text, record, index) => (
        <a onClick={this.hindDelete.bind(this, record, index)}>删除</a>
      ),
    },
  ];

  columns1 = [
    {
      title: '商品规格1',
      dataIndex: 'specAttrId1',
      width: '20%',
      render: (text, record, index) => (
        <Select placeholder="请选择" onChange={this.hindattrChange1.bind(this, index)} value={text}>
          {this.state.attrList1.map(item => (
            <Option value={item.specAttrId} key={item.specAttrId}>
              {item.specAttrName}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '商品条码',
      dataIndex: 'skuBarCode',
      width: '20%',
      render: (text, record, index) => (
        <Input value={text} onChange={this.hindBarcode.bind(this, index)} maxLength={32} />
      ),
    },

    {
      title: '成本',
      dataIndex: 'skuSupplyPrice',
      width: '10%',
      render: (text, record, index) => (
        <InputNumber
          min={0}
          max={99999}
          step={0.1}
          precision={2}
          value={text}
          onChange={this.hindsupply.bind(this, index)}
        />
      ),
    },
    {
      title: '批发价',
      dataIndex: 'skuRetailPrice',
      width: '10%',
      render: (text, record, index) => (
        <InputNumber
          min={0}
          max={99999}
          step={0.1}
          precision={2}
          value={text}
          onChange={this.hindretail.bind(this, index)}
        />
      ),
    },
    {
      title: '零售价',
      dataIndex: 'skuRecommendPrice',
      width: '10%',
      render: (text, record, index) => (
        <InputNumber
          min={0}
          max={99999}
          step={0.1}
          precision={2}
          value={text}
          onChange={this.hindreretail.bind(this, index)}
        />
      ),
    },
    {
      title: 'SKU图片',
      dataIndex: 'skuPic',
      width: '10%',
      render: (text, record, index) => (
        <PicturesWall
          acceptbrandPicImg={this.acceptbrandPicImg}
          type="3"
          pics={text ? this.getUrlToArr([text]) : []}
          index={index}
          uploadLength={1}
        />
      ),
    },

    {
      title: '操作',
      dataIndex: 'op',
      width: '10%',
      render: (text, record, index) => (
        <a onClick={this.hindDelete.bind(this, record, index)}>删除</a>
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

  isHasSame = list => {
    for (var i = 0; i < list.length; i++) {
      const endTes = list.filter(
        item => item.specAttrId1 == list[i].specAttrId1 && item.specAttrId2 == list[i].specAttrId2,
      );
      if (endTes.length > 1) {
        return false;
      }
    }
    return true;
  };

  // 提交
  handleSubmit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (this.state.pageType == '2') {
          values.spuId = this.state.spuId;
        }
        const { goodsPic } = this.state;
        if (goodsPic.length < 1) {
          message.error('请上传商品图片');
          return;
        }

        // 判断规格一和规格二选择是否一样，如果一样报提示
        if (values.specId1 == values.specId2) {
          message.error('商品规格1和商品规格2不能重复');
          return;
        }

        // 先判断table是否存在未填写项目
        const { goodsSkusouce } = this.state;

        for (let i = 0; i < goodsSkusouce.length; i++) {
          if (goodsSkusouce[i].skuBarCode || goodsSkusouce[i].skuBarCode == '0') {
            goodsSkusouce[i].skuBarCode = String(goodsSkusouce[i].skuBarCode);
          }
          if (goodsSkusouce[i].skuRetailPrice || goodsSkusouce[i].skuRetailPrice == '0') {
            goodsSkusouce[i].skuRetailPrice = String(goodsSkusouce[i].skuRetailPrice);
          }

          if (goodsSkusouce[i].skuRecommendPrice || goodsSkusouce[i].skuRecommendPrice == '0') {
            goodsSkusouce[i].skuRecommendPrice = String(goodsSkusouce[i].skuRecommendPrice);
          }
        }

        const results = goodsSkusouce.filter(
          item =>
            !item.skuBarCode ||
            !item.skuRetailPrice ||
            !item.specAttrId1 ||
            !item.skuRecommendPrice,
        );

        if (results.length > 0) {
          message.error('商品信息填写不全');
          return;
        }
        if (values.specId2 != 'none') {
          const resultsn = goodsSkusouce.filter(item => !String(item.specAttrId2));
          if (resultsn.length > 0) {
            message.error('商品信息填写不全');
            return;
          }
        }

        // 同时判断是否存在相同的规格，即规格一属性和规格二属性值一样
        const hsasd = this.isHasSame(goodsSkusouce);
        if (!hsasd) {
          message.error('商品信息存在相同的规格');
          return;
        }

        const spuPics = [];
        for (let i = 0; i < goodsPic.length; i++) {
          spuPics.push(goodsPic[i].url);
        }
        values.specId2 = values.specId2 == 'none' ? null : values.specId2;
        values.opType = this.state.pageType;
        values.spuPics = spuPics;
        values.pdPdSkuAdds = this.state.goodsSkusouce;
        values.spuDetail = this.state.infoList;

        const result = await saveGoods(values);
        if (result.code == '0') {
          message.success('操作成功');
          this.handgoback();
        }
      }
    });
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
      } else {
        const infoList = this.state.infoList.slice(0);
        infoList[index].value = null;
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
      } else {
        const goodsSkusouce = this.state.goodsSkusouce.slice(0);
        goodsSkusouce[index].skuPic = null;
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
    if (value != 'none') {
      const data = { specId: value };
      const result = await getSpecAttr(data);
      if (result.code == '0') {
        const resData = result.data || [];
        this.setState({
          attrList2: resData || [],
          specId2: value,
          spec2Select: true,
        });
      }
    } else {
      this.setState({
        spec2Select: false,
      });
    }
  };

  hindreretail = (index, value) => {
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    goodsSkusouce[index].skuRecommendPrice = value;
    this.setState({
      goodsSkusouce,
    });
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
      value: null,
    });
    this.setState({
      infoList,
    });
  };

  hindPic = () => {
    const { infoList } = this.state;
    infoList.push({
      type: '2',
      value: null,
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

  // 删除行规格
  hindDelete = (record, index) => {
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    goodsSkusouce.splice(index, 1);
    this.setState({
      goodsSkusouce,
    });
  };

  // 删除商品详情行
  hindInfoList = index => {
    const infoList = this.state.infoList.slice(0);
    infoList.splice(index, 1);
    this.setState({
      infoList,
    });
  };

  focusBink = () => {
    this.setState({
      focus1: true,
    });
  };

  hindSure = () => {
    const { focusvalue1 } = this.state;
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    if (this.state.focusvalue1 || focusvalue1 == 0) {
      for (let i = 0; i < goodsSkusouce.length; i++) {
        goodsSkusouce[i].skuSupplyPrice = focusvalue1;
      }
      // 处理数据
      this.setState({
        focus1: false,
        goodsSkusouce,
      });
    } else {
      message.error('请输入批量设置的值');
    }
  };

  hindNum1 = value => {
    this.setState({
      focusvalue1: value,
    });
  };

  focusBink2 = () => {
    this.setState({
      focus2: true,
    });
  };

  hindSure2 = () => {
    const { focusvalue2 } = this.state;
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    if (this.state.focusvalue2 || focusvalue2 == 0) {
      for (let i = 0; i < goodsSkusouce.length; i++) {
        goodsSkusouce[i].skuRetailPrice = focusvalue2;
      }
      // 处理数据
      this.setState({
        focus2: false,
        goodsSkusouce,
      });
    } else {
      message.error('请输入批量设置的值');
    }
  };

  hindNum2 = value => {
    this.setState({
      focusvalue2: value,
    });
  };

  focusBink3 = () => {
    this.setState({
      focus3: true,
    });
  };

  hindSure3 = () => {
    const { focusvalue3 } = this.state;
    const goodsSkusouce = this.state.goodsSkusouce.slice(0);
    if (this.state.focusvalue3 || focusvalue3 == 0) {
      for (let i = 0; i < goodsSkusouce.length; i++) {
        goodsSkusouce[i].skuRecommendPrice = focusvalue3;
      }
      // 处理数据
      this.setState({
        focus3: false,
        goodsSkusouce,
      });
    } else {
      message.error('请输入批量设置的值');
    }
  };

  hindNum3 = value => {
    this.setState({
      focusvalue3: value,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { pdSpu } = this.state;

    return (
      <PageHeaderWrapper title={() => ''}>
        <Card bordered={false}>
          <Form
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="商品名称">
              {getFieldDecorator('spuName', {
                initialValue: pdSpu.spuName,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    max: 50,
                    message: '最大只能输入50个字符',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品品牌">
              {getFieldDecorator('spuBrandId', {
                initialValue: pdSpu.spuBrandId,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {this.state.brandList.map(item => (
                    <Option value={item.brandId} key={item.brandId}>
                      {item.brandName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品图片">
              <PicturesWall
                acceptbrandPicImg={this.acceptbrandPicImg}
                type="1"
                pics={this.state.goodsPic || []}
                uploadLength={6}
              />
            </FormItem>
            <FormItem {...formItemLayout} label="商品卖点">
              {getFieldDecorator('spuSellingPoint', {
                initialValue: pdSpu.spuSellingPoint,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    max: 50,
                    message: '最大只能输入50个字符',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="卖点详情">
              {getFieldDecorator('spuSellingPoingStr', {
                initialValue: pdSpu.spuSellingPoingStr,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    max: 200,
                    message: '最大只能输入200个字符',
                  },
                ],
              })(<TextArea rows={4} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品规格1">
              {getFieldDecorator('specId1', {
                initialValue: pdSpu.specId1,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <Select placeholder="请选择" onChange={this.hindChange1.bind(this)}>
                  {this.state.specList.map(item => (
                    <Option value={item.specId} key={item.specId}>
                      {item.specName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem>
              <Row>
                <Col offset={4}>
                  <EditableTagGroup
                    tags={this.state.attrList1}
                    getTagData={this.getTagData1.bind(this)}
                    specId={this.state.specId1}
                  />
                </Col>
              </Row>
            </FormItem>
            <FormItem {...formItemLayout} label="商品规格2">
              {getFieldDecorator('specId2', {
                initialValue: pdSpu.specId2 || 'none',
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <Select placeholder="请选择" onChange={this.hindChange2.bind(this)}>
                  <Option value="none" key="none">
                    无
                  </Option>
                  {this.state.specList.map(item => (
                    <Option value={item.specId} key={item.specId}>
                      {item.specName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem>
              <Row>
                <Col offset={4}>
                  <EditableTagGroup
                    tags={this.state.attrList2}
                    getTagData={this.getTagData2.bind(this)}
                    specId={this.state.specId2}
                  />
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              {/* <Row>
                <Col span={4} style={{ textAlign: 'right' }}>
                  商品信息：
                </Col>
              </Row> */}
              <Row>
                <Col span={24}>
                  <EditableTable
                    title={() => (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>商品信息</span>
                        <span onClick={() => this.handaddSku()}>
                          {' '}
                          <a>新增sku</a>
                        </span>
                      </div>
                    )}
                    bordered
                    dataSource={addKeyForList(this.state.goodsSkusouce)}
                    columns={this.state.spec2Select ? this.columns : this.columns1}
                    pagination={false}
                    scroll={{ x: '1500px' }}
                  />

                  <div>
                    批量设置：
                    {this.state.focus1 ? (
                      <span style={{ marginRight: '20px' }}>
                        <InputNumber
                          min={0}
                          max={99999}
                          step={0.1}
                          precision={2}
                          onChange={this.hindNum1.bind(this)}
                        />
                        <Icon
                          type="check"
                          style={{ color: '#1890FF', marginLeft: '10px' }}
                          onClick={this.hindSure.bind(this)}
                        />
                      </span>
                    ) : (
                      <span
                        style={{ color: '#1890FF', marginRight: '10px' }}
                        onClick={this.focusBink.bind(this)}
                      >
                        {' '}
                        成本
                      </span>
                    )}
                    {this.state.focus2 ? (
                      <span style={{ marginRight: '20px' }}>
                        <InputNumber
                          min={0}
                          max={99999}
                          step={0.1}
                          precision={2}
                          onChange={this.hindNum2.bind(this)}
                        />
                        <Icon
                          type="check"
                          style={{ color: '#1890FF', marginLeft: '10px' }}
                          onClick={this.hindSure2.bind(this)}
                        />
                      </span>
                    ) : (
                      <span
                        style={{ color: '#1890FF', marginRight: '10px' }}
                        onClick={this.focusBink2.bind(this)}
                      >
                        {' '}
                        批发价
                      </span>
                    )}
                    {this.state.focus3 ? (
                      <span style={{ marginRight: '20px' }}>
                        <InputNumber
                          min={0}
                          max={99999}
                          step={0.1}
                          precision={2}
                          onChange={this.hindNum3.bind(this)}
                        />
                        <Icon
                          type="check"
                          style={{ color: '#1890FF', marginLeft: '10px' }}
                          onClick={this.hindSure3.bind(this)}
                        />
                      </span>
                    ) : (
                      <span
                        style={{ color: '#1890FF', marginRight: '10px' }}
                        onClick={this.focusBink3.bind(this)}
                      >
                        {' '}
                        零售价
                      </span>
                    )}
                  </div>
                </Col>
              </Row>
            </FormItem>
            <FormItem {...formItemLayout} label="商品详情">
              <Row>
                {/* <Col span={7}>
                  <Button type="dashed" onClick={this.hindText.bind(this)}>
                    <Icon type="plus" /> 新增文本
                  </Button>
                </Col> */}
                <Col span={14}>
                  <Button type="dashed" onClick={this.hindPic.bind(this)}>
                    <Icon type="plus" /> 新增图片
                  </Button>
                </Col>
              </Row>
              {this.state.infoList.map((item, index) =>
                (item.type == '1' ? (
                  <Row key={index}>
                    <Col span={14}>
                      <TextArea
                        rows={4}
                        onChange={this.hindTextChange.bind(this, index)}
                        value={item.value}
                      />
                    </Col>
                    <Col span={7} style={{ textAlign: 'right' }}>
                      <a onClick={this.hindInfoList.bind(this, index)}>删除</a>
                    </Col>
                  </Row>
                ) : (
                  <Row key={index}>
                    <Col span={14}>
                      <PicturesWall
                        acceptbrandPicImg={this.acceptbrandPicImg}
                        type="2"
                        index={index}
                        pics={item.value ? this.getUrlToArr([item.value]) : []}
                        uploadLength={1}
                      />
                    </Col>
                    <Col span={7} style={{ textAlign: 'right' }}>
                      <a onClick={this.hindInfoList.bind(this, index)}>删除</a>
                    </Col>
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
              <Button
                type="primary"
                style={{
                  marginLeft: 8,
                }}
                onClick={() => this.handleSubmit()}
              >
                提交
              </Button>
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
