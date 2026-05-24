import { Config } from '@remotion/cli/config';

// MP4 with H.264 + AAC. Standard for social sharing.
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // auto
