import styled from 'styled-components';

const CheckBoxWrapper = styled.div`
  position: relative;
  height: 20px;
  width: 40px;
`;
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  height: inherit;
  width: inherit;
  border-radius: 15px;
  background: ${(props) => props.theme.colors.lightBackground};
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 25px;
    width: 20px;
    height: inherit;
    background: #ffffff;
    box-shadow: 0.6px 1px 0.6px 0.6px rgba(0, 0, 0, 0.2);
    transition: margin-left 0.2s;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  height: inherit;
  width: inherit;
  &:checked + ${CheckBoxLabel} {
    background: ${(props) => props.theme.colors.toggleBackground};
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 20px;
      height: inherit;
      margin-left: calc(100% - 20px);
      transition: margin-left 0.2s;
    }
  }
`;
interface Props {
  onToggle: (active: boolean) => void;
  active: boolean;
}
const Toggle: React.FC<Props> = ({ onToggle, active = false }) => {
  return (
    <CheckBoxWrapper>
      <CheckBox checked={active} onChange={(e) => onToggle(e.target.checked)} id="checkbox" type="checkbox" />
      <CheckBoxLabel htmlFor="checkbox" />
    </CheckBoxWrapper>
  );
};

export default Toggle;
