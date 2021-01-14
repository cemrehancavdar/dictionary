import difflib as dl
import sqlite3

words_db = []
conn = sqlite3.connect('db.sqlite',check_same_thread=False)   

def refresh_words_db():
    im = conn.cursor()
    im.execute('select word from dictionary')
    veriler = im.fetchall()
    if len(words_db) > 0:
        words_db.pop(0)
    words_db.append([line[0].lower() for line in veriler])

refresh_words_db()


###  uyan kelimeleri buluyoruz. sonra gönderdiğimiz kelimeyle başlayanları da bulup hepsini bir listede topluyoruz. sonra remove_duplicate fonk ile tekrarlayan kelimeleri siliyoruz. (diflib ile gelmeyen uzun kelimeleri baş tarflarını karşılaştırıp bulduk ayrıca.)
def find_matches(word):
    words = dl.get_close_matches(word, words_db[0], n=3, cutoff=0.8)   # n : en yakın kaç değer döner
    for i in words_db[0]:
        if words!=[]:
            if i.startswith(words[0]):
                words.append(i)
            if i.startswith(word):
                words.append(i)
        else:
            if i.startswith(word):
                words.append(i)
    words = remove_duplicate(words)[:10]
    return words


### yukarıda kullandık aynı kelimeleri listeden silmek için
def remove_duplicate(duplicate):
    final_list = [] 
    for num in duplicate: 
        if num not in final_list: 
            final_list.append(num) 
    return final_list 


###  direk bir kelimeyi yazıp enter a basarsak çalışıyor
def get_description(word):
    im = conn.cursor()
    im.execute('select word,description from dictionary where word = ? COLLATE NOCASE',(word,))  # COLLATE NOCASE : diyelim ki küçük harfle arama yaptım ama veri tabanında büyük harflerle yazılıysa onu da getirir.
    veri = im.fetchone()
    #print(veri)
    return veri
