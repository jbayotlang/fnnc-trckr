require('dotenv').config();

import { ConfigService } from '@modules/config/config.service';

import { datasourceConfig } from './typeorm.config';

const configService = new ConfigService();

const config = datasourceConfig(configService);

export = config;