import { Upload, Icon, Modal, message } from 'antd';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('请上传JPG/PNG图片!');
  }
  const isLt20M = file.size / 1024 / 1024 < 30;
  if (!isLt20M) {
    message.error('请上传小于30M的图片!');
  }
  return isJpgOrPng && isLt20M;
}

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  componentDidMount() {
    this.initfileList(this.props.pics);
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.pics != this.props.pics) {
      console.log('nextprops', nextprops);
      this.initfileList(nextprops.pics);
    }
  }

  // 初始化数据
  initfileList = fileList => {
    this.setState({
      fileList: fileList || [],
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = info => {
    const { file, fileList } = info;
    if (!file.status) {
      return;
    }
    if (file.status && file.status == 'uploading') {
      this.setState({ fileList });
    }

    if (file.status && file.status == 'done') {
      if (file.response && file.response.code != '0') {
        message.error(file.response.msg);
        return;
      }
      const newfileList = fileList.filter(item => item.status == 'done');
      if (newfileList.length == fileList.length) {
        this.setState({ fileList }, function() {
          const fileList = this.state.fileList || [];
          for (let i = 0; i < fileList.length; i++) {
            fileList[i].url = fileList[i].url ? fileList[i].url : fileList[i].response.data;
            fileList[i].uid = fileList[i].uid ? fileList[i].uid : i;
          }
          this.props.acceptbrandPicImg(fileList, this.props.type, this.props.index);
        });
      } else {
        this.setState({ fileList });
      }
    }
  };

  onRemove = file => {
    const { value, onChange } = this.props;
    console.log('file', file)
    const { fileList } = this.state
    const newfileList = fileList.filter(v => v.url !== file.url);
    console.log('newfileList', newfileList)
    this.setState({
      fileList: newfileList,
    }, function() {
      this.props.acceptbrandPicImg(newfileList, this.props.type, this.props.index);
    })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { uploadLength } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/b2b/v1/pic/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          disabled={this.props.disabled}
          beforeUpload={beforeUpload}
          onRemove={this.onRemove}
        >
          {fileList.length >= uploadLength ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
