import random


def random_numbers(length: int = 6) -> int:
    rand_list = random.sample(range(1, 10), length)
    return int(''.join(map(str, rand_list)))
