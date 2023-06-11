class Maker < ApplicationRecord
  has_many :merchandises, class_name: "Merchandise", foreign_key: "maker_id"

  validates :name, presence: true
  validates :country, presence: true
  validates :founding_date, presence: true
end
