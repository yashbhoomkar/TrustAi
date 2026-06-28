import logging
import os

def setup_logger():

    os.makedirs(
        "logs/runtime",
        exist_ok=True
    )

    logger = logging.getLogger()

    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )

    file_handler = logging.FileHandler(
        "logs/runtime/trustai.log"
    )

    file_handler.setFormatter(
        formatter
    )

    logger.addHandler(
        file_handler
    )

    logger.info("=" * 80)
    logger.info("TrustAI Application Started")
    logger.info("=" * 80)

    return logger