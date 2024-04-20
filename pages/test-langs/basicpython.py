def avg(*numbers):
    total = sum(numbers)
    return float(total)/len(numbers)
    

class VendingMachine:
    def __init__(self, num_items, item_price):
        self.num_items = num_items
        self.item_price = item_price
        
    def buy(self, req_items, money):
        if (req_items > self.num_items):
            raise ValueError("Not enough items in the machine")
        else:
            if (money < (req_items * self.item_price)):
                raise ValueError("Not enough coins")
            else:
                self.num_items = self.num_items - req_items
                return money - (req_items * self.item_price)