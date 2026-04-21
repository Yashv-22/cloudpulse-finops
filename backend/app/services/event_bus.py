import json
import structlog

logger = structlog.get_logger()


class LocalEventBus:
    """
    Local in-memory event bus that replaces Redis pub/sub for local development.
    Stores events in memory and supports simple publish/subscribe.
    """
    def __init__(self):
        self._subscribers: dict[str, list] = {}
        self._events: list[dict] = []

    async def connect(self):
        logger.info("Local Event Bus initialized (in-memory, no Redis)")

    async def disconnect(self):
        logger.info("Local Event Bus disconnected")

    async def publish(self, channel: str, event_type: str, data: dict):
        message = {"event_type": event_type, "data": data}
        self._events.append(message)
        logger.info(f"Published event {event_type} to {channel} (local)")

        # Notify in-memory subscribers
        for callback in self._subscribers.get(channel, []):
            try:
                await callback(message)
            except Exception as e:
                logger.error(f"Subscriber callback error: {e}")

    async def subscribe(self, channel: str):
        logger.info(f"Subscribed to {channel} (local)")
        # Yield nothing — just a placeholder for the async generator interface
        return
        yield  # makes this an async generator


event_bus = LocalEventBus()
