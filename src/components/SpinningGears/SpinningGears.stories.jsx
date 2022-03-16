import { SpinningGears } from "./SpinningGears";

export default {
  title: "SpinningGears",
  component: SpinningGears,
};

const Template = (args) => <SpinningGears {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  width: 500,
  height: 500,
};
