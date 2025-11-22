import { mount } from 'svelte';
import '/src/app.css';
import Settings from './Setting.svelte';

const setting = mount(Settings,{
    target: document.getElementById('settting')!,
});

export default setting;