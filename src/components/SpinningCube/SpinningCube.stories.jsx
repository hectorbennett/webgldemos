import { SpinningCube } from "./SpinningCube";

export default {
  title: "SpinningCube",
  component: SpinningCube,
};

const Template = (args) => <SpinningCube {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  width: 500,
  height: 500,
};
