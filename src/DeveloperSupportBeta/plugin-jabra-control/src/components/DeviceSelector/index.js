import React from "react";
import { connect } from "react-redux";

import { setActiveDevice } from "../../store";
import * as S from "./styles";

class DeviceSelector extends React.Component {
  handleChange = event => {
    this.props.dispatch(setActiveDevice(event.target.value));
  };

  render() {
    const { devices, activeDevice } = this.props;

    if (!activeDevice) return null;

    return (
      <div>
        {[...devices]
          .sort((a, b) => a.deviceName.localeCompare(b.deviceName))
          .map(device => (
            <S.Device>
              <S.Input
                type="radio"
                value={device.deviceID}
                name="active_device"
                checked={device.deviceID === activeDevice.deviceID}
                onChange={this.handleChange}
              />
              {device.deviceName}
            </S.Device>
          ))}
      </div>
    );
  }
}

const mapStateToProps = ({ jabra }) => ({
  devices: jabra.devices.items,
  activeDevice: jabra.devices.active
});

export default connect(mapStateToProps)(DeviceSelector);
