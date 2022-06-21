import { fireEvent, waitFor, waitForElementToBeRemoved, within } from "@storybook/testing-library";
import { rest } from "msw";
import React from "react";
import { Provider } from "react-redux";
import store from "../lib/store";
import InboxScreen from "./InboxScreen";
import { MockedState } from "./TaskList.stories";

export default {
  component: InboxScreen,
  title: "InboxScreen",
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get(
        "https://jsonplaceholder.typicode.com/todos?userId=1",
        (req, res, ctx) => {
          return res(ctx.json(MockedState.tasks));
        }
      ),
    ],
  },
};

export const Error = Template.bind({});
Error.parameters = {
  msw: {
    handlers: [
      rest.get(
        "https://jsonplaceholder.typicode.com/todos?userId=1",
        (req, res, ctx) => {
          return res(ctx.status(403));
        }
      )
    ]
  }
}

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
  await waitFor(async () => {
    await fireEvent.click(canvas.getByLabelText('pinTask-1'));
    await fireEvent.click(canvas.getByLabelText('pinTask-3'));
  })
}