import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Tokens} from '../Model/Token';
import API from '../API';
export const calculateAge = (birthday: {
  year: number;
  month: number;
  day: number;
}) => {
  try {
    const jsDate = new Date(birthday.year, birthday.month - 1, birthday.day);
    const formattedDate = jsDate.toISOString().split('T')[0];
    const birthDate = new Date(formattedDate);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - birthDate.getTime());
    return {
      dt_birth: formattedDate,
      age: Math.floor(timeDiff / (1000 * 3600 * 24 * 365.25)),
    };
  } catch (err) {
    return {dt_birth: null, age: 18};
  }
};
export const getComplementarData = async () => {
  let dt_birth: string;
  let birthday: {year: number; month: number; day: number};
  let age: number;
  let gender: string;

  const {accessToken} = (await GoogleSignin.getTokens()) as Tokens;
  const response = await API.$users_sensitive_information.user_sensitive_info(
    accessToken,
  );

  response.data.birthdays.forEach(
    (element: {
      metadata: {source: {type: string}};
      date: {year: number; month: number; day: number};
    }) => {
      if (element.metadata.source.type === 'ACCOUNT') {
        birthday = element.date;
      }
    },
  );
  response.data.genders.forEach(
    (element: {
      formattedValue: string;
      metadata: {primary: boolean; source: object};
      value: string;
    }) => {
      gender = element.formattedValue;
    },
  );

  ({dt_birth, age} = calculateAge(birthday));

  return {age, dt_birth, gender};
};
