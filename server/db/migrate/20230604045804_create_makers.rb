class CreateMakers < ActiveRecord::Migration[7.0]
  def change
    create_table :makers do |t|
      t.string :name
      t.string :country
      t.date :founding_date

      t.timestamps
    end
  end
end
