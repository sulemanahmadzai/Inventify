import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f5f5f5', //for background default
            paper: '#003F62', //for sidebar bg
            nav: '#003F62', //for top navbar in main container
            sidebarSelected: '#427592',
            sidebarHover: 'rgba(255, 255, 255, 0.1)',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#FFFFFF',
            textColor: '#000000',// for default text in light mode
        },
        button: {
            primary: '#0670aa',
        },
        table: {
            bg: '#FFFFFF',
            header: '#1976d2',
            text: '#030712',
            page: 'black'
        },

        charts: {
            bg: '#FFFFFF',
            heading: '#0070af',
            text: '#1976d2',
            period: '#FFFFFF',
        }

    },
});
//030712
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#030712',  // Dark background for the page (much darker than the light theme's default)
            paper: '#030712',    // Slightly lighter than the default background, suitable for paper elements
            nav: '#242934',      // Dark navigation bar
            sidebarSelected: '#FFFFFF',  // Bright, vivid blue for sidebar selected (more vibrant)
            sidebarHover: 'rgba(255, 255, 255, 0.2)', // Slightly brighter hover effect
        },
        text: {
            primary: '#FFFFFF',  // Light grayish-white for primary text (better contrast)
            secondary: '#FFFFFF',  // Lighter gray for secondary text (still readable but less emphasized)
        },
        button: {
            primary: '#5F2DAC',
        },
        table: {
            bg: '#242934',
            header: '#1976d2',
            text: '#90caf9',
            page: '#FFFFFF'
        },
        charts: {
            heading: '#90caf9',
            text: '#90caf9 ',
            period: '#5F2DAC'
        }
    },
});
