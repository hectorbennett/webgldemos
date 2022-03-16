import { WebGLGears } from "./WebGLGears";

export default {
  title: "WebGLGears",
  component: WebGLGears,
};

const Template = (args) => <WebGLGears {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  width: 500,
  height: 500,
};
