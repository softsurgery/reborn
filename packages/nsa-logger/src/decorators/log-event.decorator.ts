import { SetMetadata } from '@nestjs/common';
import { EventType } from 'nsa-logger/enums/event-type.registry';

// Define a custom decorator
export const LogEvent = (event: EventType) => SetMetadata('event', event);
