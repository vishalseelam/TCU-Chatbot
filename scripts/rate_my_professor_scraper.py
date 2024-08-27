import requests
from bs4 import BeautifulSoup

class RateMyProfScraper:
    def __init__(self, university_id):
        self.university_id = university_id
        self.base_url = "https://www.ratemyprofessors.com"

    def search_professor(self, professor_name):
        search_url = f"{self.base_url}/search/teachers?query={professor_name}&sid={self.university_id}"
        response = requests.get(search_url)
        soup = BeautifulSoup(response.text, 'html.parser')

        professor_card = soup.find('li', class_='TeacherCard__StyledTeacherCard-syjs0d-0 dLJIlx')
        if not professor_card:
            return None
        
        professor_info = {
            'tDept': professor_card.find('div', class_='CardSchool__Department-sc-19lmz2k-0 haUIRO').text.strip(),
            'tFname': professor_card.find('span', class_='CardName__StyledSpan-sc-1gyrgim-0 cJdVEK').text.strip(),
            'tLname': professor_card.find('span', class_='CardName__StyledSpan-sc-1gyrgim-0 gGvINf').text.strip(),
            'tNumRatings': professor_card.find('div', class_='CardNumRating__CardNumRatingCount-sc-17t4b9u-3 fAeFYF').text.strip(),
            'overall_rating': professor_card.find('div', class_='CardNumRating__CardNumRatingAverage-sc-17t4b9u-2 gUyzRr').text.strip(),
            'tSid': self.university_id
        }
        return professor_info

    def print_professor_detail(self, professor_info, detail_key):
        return professor_info.get(detail_key, "Detail not found")

# Example usage
if __name__ == "__main__":
    MIT = RateMyProfScraper(580)
    prof_info = MIT.search_professor("John Smith")
    if prof_info:
        print(MIT.print_professor_detail(prof_info, 'overall_rating'))
