class CreateMakers < ActiveRecord::Migration[7.0]
  def change
    create_table :makers do |t|
      t.string :name, null: false, index: { unique: true }
      t.string :country, null: false
      t.date :founding_date, null: false

      t.timestamps
    end
  end
end
