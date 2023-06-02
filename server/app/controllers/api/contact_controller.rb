class Api::ContactController < ApplicationController
  def index
    page = params[:page].presence || 1
    @contacts = Contact.order(id: :asc).page(page)
    render json: {
      contacts: @contacts,
      pagination: {
        current_page: @contacts.current_page,
        next_page: @contacts.next_page,
        prev_page: @contacts.prev_page,
        total_pages: @contacts.total_pages,
        total_count: @contacts.total_count
      }
    }
  end

  def create
    @contact = Contact.new(contact_params)
    if @contact.save
      render json: @contact
    else
      render json: @contact.errors
    end
  end

  def destroy
    if params[:id] == '-1'
      Contact.destroy_all
      render json: { message: 'All contacts are deleted.' }
      return
    end
    @contact = Contact.find(params[:id])
    @contact.destroy
    render json: @contact
  end

  def contact_params
    params.require(:contact).permit(:title, :content, :status, :published_at, :closed_at)
  end
end
