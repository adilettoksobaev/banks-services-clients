import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

type Props = {
    lanOpen: boolean;
    langClickClose: () => void;
}
const LanguageDialog:React.FC<Props> = ({lanOpen, langClickClose}) => {
    const [value, setValue] = React.useState('ru');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <Dialog
            open={lanOpen}
            className="modal confirm">
            <DialogTitle>Выбор языка</DialogTitle>
            <DialogContent>
                <RadioGroup className="modal__RadioGroup" value={value} onChange={handleChange}>
                    <FormControlLabel value="kg" control={<Radio color="primary" />} label="Кыргызча" />
                    <FormControlLabel value="ru" control={<Radio color="primary" />} label="Русский" />
                </RadioGroup>
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button onClick={langClickClose} color="primary">Отмена</Button>
                <Button onClick={langClickClose} variant="contained" color="primary" disableElevation>Подтвердить</Button>
            </DialogActions>
        </Dialog>
    );
}

export default LanguageDialog;