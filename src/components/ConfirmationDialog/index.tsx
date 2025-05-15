import {Alert} from 'react-native';

const ConfirmationDialog = ({title, message, onConfirm, onCancel}) => {
  const handleConfirmation = () => {
    Alert.alert(title, message, [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirmar',
        onPress: onConfirm,
      },
    ]);
  };

  return handleConfirmation();
};

export default ConfirmationDialog;
