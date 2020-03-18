import { Tag, Input, Tooltip, Icon, message } from 'antd';
import { delSpecAttr, addSpecAttr } from '@/services/goods';

class EditableTagGroup extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  handleClose = async removedTag => {
    const data = { opType: '3', specAttrId: removedTag.specAttrId, specId: this.props.specId };
    const result = await delSpecAttr(data);
    if (result.code == '0') {
      const tags = this.props.tags.filter(tag => tag.specAttrName !== removedTag.specAttrName);
      this.props.getTagData(tags);
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = async () => {
    const { inputValue } = this.state;
    let { tags } = this.props;
    if (inputValue && tags.filter(item => item.specAttrName == inputValue).length < 1) {
      // 新增tag，获取tagId
      const data = { opType: '1', specAttrName: inputValue, specId: this.props.specId };
      const result = await addSpecAttr(data);
      if (result.code == '0') {
        const specAttrId = result.data;
        tags = [...tags, { specAttrName: inputValue, specAttrId }];
        this.props.getTagData(tags);
        this.setState({
          inputVisible: false,
          inputValue: '',
        });
      }
    } else {
    }
  };

  saveInputRef = input => (this.input = input);

  render() {
    const { inputVisible, inputValue } = this.state;
    const { tags } = this.props;
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.specAttrName.length > 20;
          const tagElem = (
            <Tag

              key={tag.specAttrName}
              closable={this.props.disabled ? false : tags.length > 1}
              onClose={() => this.handleClose(tag)}
            >
              {isLongTag ? `${tag.specAttrName.slice(0, 20)}...` : tag.specAttrName}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag.specAttrName} key={tag.specAttrName}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && !this.props.disabled && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> 新增
          </Tag>
        )}
      </div>
    );
  }
}

export default EditableTagGroup;
