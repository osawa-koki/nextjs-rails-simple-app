class Maker < ApplicationRecord
  validates :name, presence: true
  validates :country, presence: true
  validates :founding_date, presence: true
end
