import React from "react";
import { connect } from "react-redux";
import * as Flex from "@twilio/flex-ui";
import ReactTooltip from "react-tooltip";
import * as jabra from "jabra-browser-integration";
import * as S from "./styles";

// const Device = ({ initialized, installed, active_device, ...props }) => {
//   if (!initialized) return null;

//   const invalid = !(installed && active_device);

//   return (
//     <>
//       <S.Base>
//         <S.Logo data-tip data-for="jabra-device" invalid={invalid} />
//       </S.Base>
//       <ReactTooltip id="jabra-device" place="bottom" effect="solid">
//         <span>
//           {!installed
//             ? "Browser SDK installation incomplete. Please (re)install"
//             : !active_device
//             ? "Couldn't find any active device"
//             : active_device.deviceName}
//         </span>
//       </ReactTooltip>
//     </>
//   );
// };

class Device extends React.Component {
  manager = Flex.Manager.getInstance();

  async componentDidMount() {
    this.enumerateDevices();

    jabra.addEventListener("device attached", asd => {
      setTimeout(() => {
        this.enumerateDevices();
      }, 1000);
    });
  }

  enumerateDevices = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      let inputDevice = null;
      let outputDevice = null;
      this.manager.voiceClient.audio.availableInputDevices.forEach(
        (device, id) => {
          if (device.label.toLowerCase().includes("jabra")) {
            inputDevice = device;
          }
        }
      );

      this.manager.voiceClient.audio.availableOutputDevices.forEach(
        (device, id) => {
          if (device.label.toLowerCase().includes("jabra")) {
            outputDevice = device;
          }
        }
      );

      if (inputDevice) {
        await this.manager.voiceClient.audio.setInputDevice(
          inputDevice.deviceId
        );

        console.info(
          `Successfully set ${inputDevice.label} as active input device`,
          inputDevice
        );
      }
      if (outputDevice) {
        await this.manager.voiceClient.audio.speakerDevices.set(
          outputDevice.deviceId
        );

        console.info(
          `Successfully set ${outputDevice.label} as active input device`,
          outputDevice
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { initialized, installed, active_device } = this.props;
    const invalid = !(installed && active_device);

    if (!initialized) return null;

    return (
      <>
        <S.Base>
          <S.Logo data-tip data-for="jabra-device" invalid={invalid} />
        </S.Base>
        <ReactTooltip id="jabra-device" place="bottom" effect="solid">
          <span>
            {!installed
              ? "Browser SDK installation incomplete. Please (re)install"
              : !active_device
              ? "Couldn't find any active device"
              : active_device.deviceName}
          </span>
        </ReactTooltip>
      </>
    );
  }
}

const mapStateToProps = state => {
  return state.jabra;
};

export default connect(mapStateToProps)(Device);
