import React, { useEffect, useState } from 'react';
import { Switch, theme } from 'antd';

const ToggleDarkMode = (): React.ReactElement => {
    const defaultLocalData = localStorage.getItem('darkMode') === 'true' ? true : false;
    const [checked, setChecked] = useState<boolean>(defaultLocalData);
    
    useEffect(() => {
        localStorage.setItem('darkMode', checked ? 'true' : 'false');
    }, [checked]);
    
    return (
        <Switch
        checkedChildren="🌙"
        unCheckedChildren="🌞"
        checked={checked}
        onChange={setChecked}
        />
    );
}

export default ToggleDarkMode;