import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  test: [
    'test/**/*.js'
  ],
  ignored: [
    'tmp'
  ]
};

export default [
  {
    'ignores': files.ignored
  },

  ...bpmnIoPlugin.configs.node,

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: files.test
    };
  })
];