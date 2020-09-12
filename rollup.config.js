import typescript from '@wessberg/rollup-plugin-ts';
import typescript2 from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';
import path from 'path';
import postcssUrl from "postcss-url";
import autoExternal from 'rollup-plugin-auto-external';
import visualizer from 'rollup-plugin-visualizer';

const getPluginConfig = (target) => {
    let config = [];

    // umd specific plugins
    if(target === 'umd'){
        config = [
            nodeResolve(["jsnext:main", "module", "main"]),
            typescript2(),
            commonjs(),
            json(),
            terser(), 
            postcss({
                extract:'tsiclient.min.css',
                plugins: [
                    postcssUrl({
                        url: 'inline',
                    })
                ],
                minimize: true,
                sourceMap: true
            }),
            visualizer({filename: 'ignored/umd_stats.html'})
        ]
    }

    // esm specific plugins
    if(target === 'esm'){
        config = [
            nodeResolve(["jsnext:main", "module", "main"]),
            typescript(),
            autoExternal(),
            commonjs(),
            json(),
            postcss({
                extract:'tsiclient.css',
                plugins: [
                    postcssUrl({
                        url: 'inline',
                    })
                ],
                minimize: false,
                sourceMap: false
            }),    
            visualizer({filename: 'ignored/esm_stats.html'})
        ]
    }

    return config;
}

export default () => {
    // browser-friendly UMD build ()
    const browserBundle = 
    {
        input: 'src/TsiClient.ts',
        output: {
            file: path.join('dist', pkg.main),
            format: 'umd',
            name: 'TsiClient',
            sourcemap: true,
        },
        context: "window"
    };

    // ESM Component build
    const esmComponentBundle = 
    {
        input: {
            // TsiClient core
            ServerClient: 'src/ServerClient/ServerClient.ts',
            UXClient: 'src/UXClient/UXClient.ts',
            Utils: 'src/UXClient/Utils.ts',
            
            // Direct component imports 
            LineChart: 'src/UXClient/Components/LineChart/LineChart.ts',
            AvailabilityChart: 'src/UXClient/Components/AvailabilityChart/AvailabilityChart.ts',
            PieChart: 'src/UXClient/Components/PieChart/PieChart.ts',
            ScatterPlot: 'src/UXClient/Components/ScatterPlot/ScatterPlot.ts',
            GroupedBarChart: 'src/UXClient/Components/GroupedBarChart/GroupedBarChart.ts',
            Grid: 'src/UXClient/Components/Grid/Grid.ts',
            Slider: 'src/UXClient/Components/Slider/Slider.ts',
            Hierarchy: 'src/UXClient/Components/Hierarchy/Hierarchy.ts',
            AggregateExpression: 'src/UXClient/Models/AggregateExpression.ts',
            Heatmap: 'src/UXClient/Components/Heatmap/Heatmap.ts',
            EventsTable: 'src/UXClient/Components/EventsTable/EventsTable.ts',
            ModelSearch: 'src/UXClient/Components/ModelSearch/ModelSearch.ts',
            DateTimePicker: 'src/UXClient/Components/DateTimePicker/DateTimePicker.ts',
            TimezonePicker: 'src/UXClient/Components/TimezonePicker/TimezonePicker.ts',
            EllipsisMenu: 'src/UXClient/Components/EllipsisMenu/EllipsisMenu.ts',
            TsqExpression: 'src/UXClient/Models/TsqExpression.ts',
            ModelAutocomplete: 'src/UXClient/Components/ModelAutocomplete/ModelAutocomplete.ts',
            HierarchyNavigation: 'src/UXClient/Components/HierarchyNavigation/HierarchyNavigation.ts',
            SingleDateTimePicker:'src/UXClient/Components/SingleDateTimePicker/SingleDateTimePicker.ts',
            DateTimeButtonSingle: 'src/UXClient/Components/DateTimeButtonSingle/DateTimeButtonSingle.ts',
            DateTimeButtonRange: 'src/UXClient/Components/DateTimeButtonRange/DateTimeButtonRange.ts',
            ProcessGraphic: 'src/UXClient/Components/ProcessGraphic/ProcessGraphic.ts',
            PlaybackControls: 'src/UXClient/Components/PlaybackControls/PlaybackControls.ts',
            ColorPicker: 'src/UXClient/Components/ColorPicker/ColorPicker.ts',
            GeoProcessGraphic: 'src/UXClient/Components/GeoProcessGraphic/GeoProcessGraphic.ts'
        },
        output: {
            dir: 'dist',
            format: 'esm',
            sourcemap: false
        },
        context: "window"
    }

    // Attach plugins to browserBundle
    browserBundle.plugins = getPluginConfig('umd');

    // Attach plugins to esmComponentBundle
    esmComponentBundle.plugins = getPluginConfig('esm');

    let bundle = [esmComponentBundle, browserBundle]
    
    return bundle;
};