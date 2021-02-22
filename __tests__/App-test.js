import 'react-native';
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react-native';
import React from 'react';
import App from '../App';
import renderer, { act } from 'react-test-renderer';
import Main from '../Main';
import { Alert } from 'react-native';

it('renders correctly', () => {
  renderer.create(<App />);
});

describe('Sad Path', () => {
  it('Check if button gets re-enabled after error occurs during processing', async () => {
    const fakeQuerySimulationEngine = jest.fn(() => Promise.reject());
    const { getByTestId, queryByText } = render(
      <Main querySimulationEngine={fakeQuerySimulationEngine} />,
    );

    const btSubmit = getByTestId('btSubmit');
    fireEvent.press(btSubmit);

    expect(btSubmit).toBeDisabled();
    expect(fakeQuerySimulationEngine).toHaveBeenCalled();
    await waitForElementToBeRemoved(() => queryByText('Processing...'));
    expect(btSubmit).not.toBeDisabled();
  });

  it('Check if error message is displayed when processing error occurs', async () => {
    jest.spyOn(Alert, 'alert');
    const errorMessage = "Error occured"
    const fakeQuerySimulationEngine = jest.fn(() => Promise.reject({ response: { data: errorMessage } }));
    const { getByTestId, queryByText } = render(
      <Main querySimulationEngine={fakeQuerySimulationEngine} />,
    );

    const btSubmit = getByTestId('btSubmit');
    fireEvent.press(btSubmit);

    expect(fakeQuerySimulationEngine).toHaveBeenCalled();
    await waitForElementToBeRemoved(() => queryByText('Processing...'));
    expect(Alert.alert).toHaveBeenCalledWith(`Error: ${errorMessage}`)
  });
})

describe('Happy Path', () => {

  it('Check if button gets disabled while processing', async () => {
    const fakeQuerySimulationEngine = jest.fn(() => Promise.resolve());
    const { getByTestId, queryByText } = render(
      <Main querySimulationEngine={fakeQuerySimulationEngine} />,
    );

    const btSubmit = getByTestId('btSubmit');
    fireEvent.press(btSubmit);

    expect(btSubmit).toBeDisabled();
    expect(fakeQuerySimulationEngine).toHaveBeenCalled();
    await waitForElementToBeRemoved(() => queryByText('Processing...'));
    expect(btSubmit).not.toBeDisabled();
  });


  it('Check if correct data is sent to simulation API', async () => {
    const fakeQuerySimulationEngine = jest.fn(() => Promise.resolve());
    const { getByTestId, queryByText } = render(
      <Main querySimulationEngine={fakeQuerySimulationEngine} />,
    );
    const numberOfSimulations = 100;
    const isSwitching = true;
    fireEvent.changeText(getByTestId('txtSimulations'), `${numberOfSimulations}`);
    fireEvent(getByTestId('cbIsSwitching'), 'onValueChange', { nativeEvent: { value: isSwitching } });

    const btSubmit = getByTestId('btSubmit');
    fireEvent.press(btSubmit);

    expect(btSubmit).toBeDisabled();
    expect(fakeQuerySimulationEngine).toHaveBeenCalledWith(`${numberOfSimulations}`, isSwitching);
    await waitForElementToBeRemoved(() => queryByText('Processing...'));
  });


  it('check if simulation results are displayed properly', async () => {
    const data = { wins: 10, losses: 10, numberOfSimulations: 1000, percentageOfWins: 0.5 }
    const fakeQuerySimulationEngine = jest.fn(() => Promise.resolve({ data: data }));

    const { getByTestId, queryByText } = render(
      <Main querySimulationEngine={fakeQuerySimulationEngine} />,
    );
    fireEvent.changeText(getByTestId('txtSimulations'), `${data.numberOfSimulations}`);
    const btSubmit = getByTestId('btSubmit');

    fireEvent.press(btSubmit);

    expect(fakeQuerySimulationEngine).toHaveBeenCalled();

    await waitForElementToBeRemoved(() => queryByText('Processing...'));
    expect(getByTestId("lbPercentageOfWins")).toHaveTextContent(`Percentage of Wins: ${data.percentageOfWins * 100} %`);
    expect(getByTestId("lbWins")).toHaveTextContent(`Wins: ${data.wins}`);
    expect(getByTestId("lbLosses")).toHaveTextContent(`Losses: ${data.losses}`);
    expect(getByTestId("lbGames")).toHaveTextContent(`Simulated Games: ${data.numberOfSimulations}`);
  });
})


