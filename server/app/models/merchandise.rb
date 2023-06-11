class Merchandise < ApplicationRecord
  has_one :maker, class_name: "Maker", foreign_key: "id"

  validates :name, presence: true
  validates :price, presence: true
  validates :description, presence: true
  validates :is_available, presence: true
  validates :maker_id, presence: true
end
